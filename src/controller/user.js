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
        const bookmarks = await repo.user.getBookmarkById(+id)
        res.status(200).json({ user, reviews, bookmarks })
    } catch (err) {
        next(err)
    }
    return
}
module.exports.getMe = async (req, res, next) => {
    try {
        const { id } = req.user
        const user = await repo.user.userGetProfile(+id)
        if (!user) throw new CustomError("not found user", "WRONG_INPUT", 400)
        const reviews = await repo.user.getReview(+id)
        const bookmarks = await repo.user.getBookmarkById(+id)
        delete user.password
        delete user.createdAt
        delete user.googleId
        delete user.facebookId
        user.role = "USER"

        res.status(200).json({ user, reviews, bookmarks })

        // res.status(200).json({ user: req.user })
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
        user.role = "USER"
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
        user.role = "USER"
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
            user.role = "USER"

            res.status(200).json({ token, user })
            return
        }
        // console.log("สมัครเเล้ว")
        const token = utils.jwt.sign({ userId: findUser.id })

        delete findUser.password
        delete findUser.createdAt
        delete findUser.googleId
        delete findUser.facebookId
        findUser.role = "USER"
        res.status(200).json({ user: findUser, token })
    } catch (err) {
        next(err)
    }
}

module.exports.update = async (req, res, next) => {
    try {
        // const id = req.body.id
        // const data = {
        //     name: req.body.name,
        //     mobile: req.body.mobile,
        //     gender: req.body.gender,
        //     birthdate: req.body.birthdate,
        //     imgProfile: req.body.imgProfile,
        // }
        if (req.body.birthdate) {
            req.body.birthdate = req.body.birthdate + "T12:00:00.000Z"
        }
        console.log(req.body.mobile)
        if (req.body.mobile) {
            const e = await repo.user.mobileIsDupplicate(req.body.mobile)
            console.log(e)
            if (e) {
                throw new CustomError("mobile invalid", "WRONG_INPUT", 400)
                return
            }
        }
        // console.log("req.body.birthdate", req.body.birthdate)
        // console.log(req.user.id, "req.user.id")
        const user = await repo.user.update(req.user.id, req.body)
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

module.exports.updatePassword = async (req, res, next) => {
    try {
        if (req.body.newPassword != req.body.confirmPassword) {
            throw new CustomError("new password and contirm password invalid", "WRONG_INPUT", 400)
        }
        const checkpassword = await repo.user.getPassword(req.user.id)
        const pass = await utils.bcrypt.compare(req.body.password, checkpassword.password)
        if (!pass) {
            throw new CustomError("password invalid", "WRONG_INPUT", 400)
        }

        const password = await utils.bcrypt.hashed(req.body.newPassword)
        await repo.user.update(req.user.id, { password })

        res.status(201).json({ message: "success" })
    } catch (error) {
        next(error)
    }
}

module.exports.updateMobile = async (req, res, next) => {
    try {
        const id = req.body.id

        const checkMobile = await repo.user.checkMobile(req.body.mobile)
        console.log("checkMobile", checkMobile)
        if (checkMobile) {
            throw new CustomError("mobile invalid", "WRONG_INPUT", 400)
            return
        }

        console.log("req.body.birthdate", req.body.birthdate)
        const user = await repo.user.update(id, { mobile: req.body.mobile })
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
module.exports.updateProfile = async (req, res, next) => {
    try {
        console.log(req.body)
        console.log(req.files.imgProfile)
        // const imgProfile = {}
        // if (req.files.imgProfile) {
        const imgProfile = await uploadCloudinary(req.files.imgProfile[0].path)
        fs.unlink(req.files.imgProfile[0].path)
        // }
        const user = await repo.user.update(+req.body.id, { imgProfile })
        res.status(200).json({ user })
    } catch (err) {
        next(err)
    }
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

module.exports.createReview = async (req, res, next) => {
    try {
        // console.log(req.files.img)
        // console.log(req.body, "body")
        const ALLIMGE = []
        for (let i of req.files.img) {
            ALLIMGE.push({ img: await uploadCloudinary(i.path) })
            fs.unlink(i.path)
        }

        // console.log(ALLIMGE)
        req.body.userId = +req.user.id
        req.body.restaurantId = +req.body.restaurantId
        req.body.star = +req.body.star
        const review = await repo.user.createReview(req.body, ALLIMGE)
        res.status(200).json({ review })
    } catch (err) {
        console.log(err)
        next(err)
    }
    return
}

module.exports.updateReview = async (req, res, next) => {
    try {
        const isOwn = await repo.user.checkOwnerReview(+req.user.id, +req.body.id)
        if (!isOwn) {
            throw new CustomError("not your", "WRONG_INPUT", 400)
            return
        }
        const dataReview = { ...req.body }
        delete dataReview.id
        const data = await repo.user.updateReview(dataReview, req.body.id)
        res.status(200).json({ message: "updated", data })
    } catch (err) {
        next(err)
    }
}
module.exports.updateReviewImg = async (req, res, next) => {
    try {
        //
    } catch (err) {
        next(err)
    }
}

module.exports.deleteReview = async (req, res, next) => {
    try {
        console.log(req.params)
        const deleteReviewImg = await repo.user.deleteReviewImg(+req.params.id)
        console.log(deleteReviewImg)

        const data = await repo.user.deleteReview(+req.params.id)
        console.log(data)

        res.status(204).json({ message: "deleted" })
    } catch (err) {
        next(err)
    }
}

module.exports.getBookmark = async (req, res, next) => {
    try {
        const { id } = req.params

        const bookmarks = await repo.user.getBookmark({ userId: req.user.id, restaurantId: parseInt(id) })
        if (bookmarks) {
            res.status(200).json({ bookmarks: true })
        } else {
            res.status(200).json({ bookmarks: false })
        }
    } catch (err) {
        next(err)
    }
}
