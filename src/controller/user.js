const repo = require("../repository")
const utils = require("../utils")
const { CustomError } = require("../config/error")
const { Role } = require("@prisma/client")
const { uploadCloudinary } = require("../services/upload-cloudinary")
const fs = require("fs/promises")
const { execute } = require("../db")
const axios = require("axios")

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
        // console.log(req.params)
        const { id } = req.params
        const user = await repo.user.userGetProfile(+id)
        if (!user) throw new CustomError("not found user", "WRONG_INPUT", 400)
        const reviews = await repo.user.getReview(+id)
        const bookmarks = await repo.user.getBookmark(+id)
        res.status(200).json({ user, reviews, bookmarks })
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
        // console.log(req.body, "******")
        const user = await repo.user.get(username)
        // console.log(user, "user")
        if (!user) throw new CustomError("Username is wrong", "WRONG_INPUT", 400)

        // COMPARE password with database
        const result = await utils.bcrypt.compare(password, user.password)
        if (!result) throw new CustomError("Password is wrong", "WRONG_INPUT", 400)

        // DELETE KEY of password from user data
        delete user.password
        delete user.createdAt
        delete user.googleId
        delete user.facebookId
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
        delete user.createdAt
        delete user.googleId
        delete user.facebookId
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
        console.log(req.body)

        // const response = await axios.get(
        //     `https://graph.facebook.com/v6.0/oauth/access_token?grant_type=fb_exchange_token&client_id=702344342107870&client_secret=57d3d0fdb5b6b7c565e43aab83bad656&fb_exchange_token=${req.body.accessToken}`,
        // )
        // console.log(response)
        const findUser = await repo.user.findUserFacebook(req.body.id)

        if (findUser) {
            const token = utils.jwt.sign({ userId: findUser.id })

            delete findUser.password
            delete findUser.createdAt
            delete findUser.googleId
            delete findUser.facebookId

            res.status(200).json({ user: findUser, token })
            return
        }
        const user = await repo.user.createUserLoginWithFacebook({ facebookId: req.body.id, name: req.body.name })
        const token = utils.jwt.sign({ userId: user.id })
        delete user.password
        delete user.createdAt
        delete user.googleId
        delete user.facebookId
        res.status(200).json({ token, user })
        // res.status(200).json({ message: "SSS" })
        return
    } catch (err) {
        next(err)
    }
}

module.exports.registerGoogle = async (req, res, next) => {
    try {
        // console.log(req.body)
        // console.log(req.body.wt.Ad)
        const findUser = await repo.user.findUserGoogle(req.body.googleId)
        if (!findUser) {
            const user = await repo.user.registerGoogle(req.body.googleId, req.body.wt.Ad, req.body.profileObj.imageUrl)

            const token = utils.jwt.sign({ userId: user.id })

            delete user.password
            delete user.createdAt
            delete user.googleId
            delete user.facebookId

            res.status(200).json({ token, user })
            return
        }
        // console.log("สมัครเเล้ว")
        const token = utils.jwt.sign({ userId: findUser.id })

        delete findUser.password
        delete findUser.createdAt
        delete findUser.googleId
        delete findUser.facebookId

        res.status(200).json({ user: findUser, token })
    } catch (err) {
        next(err)
    }
}

module.exports.update = async (req, res, next) => {
    try {
        const id = req.body.id
        const data = {
            name: req.body.name,
            mobile: req.body.mobile,
            gender: req.body.gender,
            birthdate: req.user.birthdate,
            imgProfile: req.body.imgProfile,
        }
        const user = await repo.user.update(id, data)
        delete user.password
        delete user.createdAt
        delete user.googleId
        delete user.facebookId

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
