const express = require("express")

const c = require("../controller")
const authenticate = require("../middlewares/authenticate")

const merchantRoute = express.Router()

merchantRoute.get("/", c.merchant.getAll)

module.exports = merchantRoute
