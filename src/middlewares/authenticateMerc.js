const jwt = require("jsonwebtoken")
const prisma = require("../config/prisma")
const CustomError = require("../config/error")

module.exports = async function authenticateMerc(req, res, next) {
    try {
        if (!req?.headers?.authorization) throw new Error()
        const authorization = req?.headers?.authorization.startsWith("Bearer")
            ? req.headers.authorization
            : next(new CustomError("Not found Bearer token", "InvalidToken", 400))

        const token = authorization.split(" ")[1] ? authorization.split(" ")[1] : next(new CustomError("Not found Bearer token", "InvalidToken", 400))
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY ?? "key")

        // console.log(decoded)
        const data = await prisma.merchant.findFirst({ where: { id: decoded.merchantId } })
        if (!data) next(new CustomError("Your accound has been delete", "NotFoundData", 500))
        req.merchant = data

        next()
    } catch (err) {
        next(err)
    }
}
