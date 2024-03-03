const utils = require("../utils")
const jwt = require("jsonwebtoken")

module.exports.isOwn = (req, res, next) => {
    console.log(req.user.id)
    console.log(req.body.id)
    if (+req.user.id == +req.body.id) return next()

    res.status(400).json({ message: "not yours" })
}
