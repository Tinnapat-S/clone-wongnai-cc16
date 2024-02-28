const repo = require("../repository")
const utils = require("../utils")
const { CustomError } = require("../config/error")
const { Role } = require("@prisma/client")
module.exports.getAll = async (req, res, next) => {
    try {
        const restaurant = await repo.restaurants.getAll()
        //const users = await repo.user.getAll()
        res.status(200).json({ users })
    } catch (err) {
        next(err)
    }
    return
}
