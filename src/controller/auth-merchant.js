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
        const users = await repo.merchant.getAll()
        res.status(200).json({ users })
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
        const { name, mobile, email, password, confirmPassword} = req.body
        console.log(req.body)
        // console.log(req.files.imgProfile[0].path)
        

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
        const user = await repo.merchant.create({ ...req.body, password: hashed })
        // DELETE KEY of password from user data
        delete user.password
        delete user.createdAt
       
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


module.exports.update = async (req, res, next) => {
    try {
        const id = req.body.id
        const data = {
            name: req.body.name,
            mobile: req.body.mobile,
          
        }
        const user = await repo.merchant.update(id, data)
        delete user.password
      
        

        res.status(200).json({ user })
    } catch (err) {
        next(err)
    }
    return
}

module.exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params
        await repo.merchant.delete({ id })
        res.status(200)
    } catch (err) {
        next(err)
    }
    return
}





