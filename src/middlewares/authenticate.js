const jwt = require("jsonwebtoken")
const prisma = require("../config/prisma")
const CustomError = require("../config/error")

module.exports = async function authenticate(req, res, next) {
    try {
        if (!req?.headers?.authorization) throw new Error()
        const authorization = req?.headers?.authorization.startsWith("Bearer")
            ? req.headers.authorization
            : next(new CustomError("Not found Bearer token", "InvalidToken", 400))

        const token = authorization.split(" ")[1] ? authorization.split(" ")[1] : next(new CustomError("Not found Bearer token", "InvalidToken", 400))
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY ?? "key")

        // console.log(decoded)
        const data = await prisma.user.findFirst({ where: { id: decoded.userId } })
        if (!data) next(new CustomError("Your account has been delete", "NotFoundData", 500))
        req.user = data

        next()
    } catch (err) {
        next(err)
    }
}
