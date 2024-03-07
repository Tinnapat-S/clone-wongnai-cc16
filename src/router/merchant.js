const express = require("express")
const controller = require("../controller")
const { validateLogin } = require("../middlewares/validators/validate-mer")

const merchRoute = express.Router()

merchRoute.get('/province', controller.merchant.getProvince)
merchRoute.post('/district', controller.merchant.getDistrict)
merchRoute.post('/sub-district', controller.merchant.getSubDistrict)
merchRoute.post('/login',validateLogin,controller.merchant.login)

module.exports = merchRoute