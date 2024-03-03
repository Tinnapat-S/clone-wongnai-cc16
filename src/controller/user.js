const repo = require("../repository")
const utils = require("../utils")
const { CustomError } = require("../config/error")
const { Role } = require("@prisma/client")
const { uploadCloudinary } = require("../services/upload-cloudinary")
const fs = require("fs/promises")
const { execute } = require("../db")

module.exports.getAll = async (req, res, next) => {
    try {
        const users = await repo.user.getAll()
        res.status(200).json({ users })
    } catch (err) {
        next(err)
    }
    return
}
module.exports.get = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await repo.user.get({ id })
        res.status(200).json({ user })
    } catch (err) {
        next(err)
    }
    return
}
module.exports.getMe = async (req, res, next) => {
    try {
        res.status(200).json({ user: req.user })
    } catch (err) {
        next(err)
    }
    return
}
module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        // GET username from database
        console.log(req.body)
        const user = await repo.user.get(username)
        if (!user) throw new CustomError("Username is wrong", "WRONG_INPUT", 400)

        // COMPARE password with database
        const result = await utils.bcrypt.compare(password, user.password)
        if (!result) throw new CustomError("Password is wrong", "WRONG_INPUT", 400)

        // DELETE KEY of password from user data
        delete user.password
        // SIGN token from user data
        const token = utils.jwt.sign({ userId: user.id })
        res.status(200).json({ token, user: user })
    } catch (err) {
        next(err)
    }
    return
}
module.exports.register = async (req, res, next) => {
    try {
        const { name, mobile, email, password, confirmPassword, gender, imgProfile, birthdate } = req.body
        console.log(req.body)
        // console.log(req.files.imgProfile[0].path)
        req.body.birthdate = req.body.birthdate + "T12:00:00.000Z"
        if (req.files.imgProfile) {
            req.body.imgProfile = await uploadCloudinary(req.files.imgProfile[0].path)

            fs.unlink(req.files.imgProfile[0].path)
        }

        const emailIsDuplicate = await repo.user.emailIsDuplicate(email)
        if (emailIsDuplicate) {
            throw new CustomError("Email is already to use", "WRONG_INPUT", 400)
        }
        const mobileDuplicate = await repo.user.mobileIsDupplicate(mobile)
        if (mobileDuplicate) {
            throw new CustomError("Mobile is already to use", "WRONG_INPUT", 400)
        }

        // console.log(req.body)
        delete req.body.confirmPassword
        // HASHED PASSWORD
        const hashed = await utils.bcrypt.hashed(password)
        console.log(hashed)
        // CREATE user to database
        const user = await repo.user.create({ ...req.body, password: hashed })
        // DELETE KEY of password from user data
        delete user.password
        // SIGN token from user data
        // console.log(user)
        console.log(user)
        const token = utils.jwt.sign({ userId: user.id })

        res.status(200).json({ token, user })
    } catch (err) {
        console.log(err)
        next(err)
    }
    return
}
module.exports.registerFacebook = async (req, res, next) => {
    try {
        const findUser = await repo.user.findUserFacebook(req.body.id)

        if (findUser) {
            const token = utils.jwt.sign({ userId: findUser.id })
            res.status(200).json({ user: findUser, token })
            return
        }
        const user = await repo.user.createUserLoginWithFacebook({ facebookId: req.body.id, name: req.body.name })
        const token = utils.jwt.sign({ userId: user.id })
        console.log(user)
        res.status(200).json({ token, user })
        // res.status(200).json({ message: "SSS" })
        return
    } catch (err) {
        next(err)
    }
}

module.exports.update = async (req, res, next) => {
    try {
        const { id } = req.params
        const { firstName, lastName } = req.body
        const user = await repo.user.update({ id }, { firstName, lastName })

        res.status(200).json({ user })
    } catch (err) {
        next(err)
    }
    return
}
module.exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params
        await repo.user.delete({ id })
        res.status(200)
    } catch (err) {
        next(err)
    }
    return
}

module.exports.bookmark = async (req, res, next) => {
    try {
        console.log("test")
        let id = 1
        const { restaurantId } = req.body
        const bookmarkExist = await repo.user.getBookmark({ userId: id, restaurantId })
        if (bookmarkExist) {
            await repo.user.deleteBookmark(bookmarkExist.id)
            return res.status(200).json({ bookmark: false })
        } else {
            await repo.user.createBookmark({ userId: id, restaurantId })
            return res.status(200).json({ bookmark: true })
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
    return
}
