const jwt = require("jsonwebtoken")
const prisma = require("../config/prisma")
const CustomError = require("../config/error")
module.exports = async function getUser(req, res, next) {
    try {
        if (!req?.headers?.authorization) return next()
        const authorization = req?.headers?.authorization?.startsWith("Bearer") ? req.headers.authorization : false

        if (authorization) {
            const token = authorization.split(" ")[1] ? authorization.split(" ")[1] : null
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY ?? "key")
            const data = await prisma.user.findFirst({ where: { id: decoded.userId } })
            req.user = data
            next()
        } else {
            next()
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
}
