const repo = require("../repository")
const utils = require("../utils")
const { CustomError } = require("../config/error")
const { Role } = require("@prisma/client")

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
module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        // GET username from database
        const user = await repo.user.get({ username })
        if (!user) throw new CustomError("username or password is wrong", "WRONG_INPUT", 400)

        // COMPARE password with database
        const result = await utils.bcrypt.compare(password, user.password)
        if (!result) throw new CustomError("username or password is wrong", "WRONG_INPUT", 400)

        // DELETE KEY of password from user data
        delete user.password
        // SIGN token from user data
        const token = utils.jwt.sign(user)
        res.status(200).json({ token })
    } catch (err) {
        next(err)
    }
    return
}
module.exports.register = async (req, res, next) => {
    try {
        const { username, password, firstName, lastName } = req.body
        let role = Role.USER
        if (req.body.role != Role.ADMIN) role = Role.ADMIN
        // HASHED PASSWORD
        const hashed = await utils.bcrypt.hashed(password)
        // CREATE user to database
        const user = await repo.user.create({ username, password: hashed, firstName, lastName, role })
        // DELETE KEY of password from user data
        delete user.password
        // SIGN token from user data
        const token = utils.jwt.sign(user)

        res.status(200).json({ token })
    } catch (err) {
        next(err)
    }
    return
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
