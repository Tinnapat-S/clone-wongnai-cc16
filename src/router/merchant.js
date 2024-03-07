const express = require("express")
const controller = require("../controller")
const { validateLogin, validateRegister } = require("../middlewares/validators/validate-mer")

const merchRoute = express.Router()

merchRoute.get('/province', controller.merchant.getProvince)
merchRoute.post('/district', controller.merchant.getDistrict)
merchRoute.post('/sub-district', controller.merchant.getSubDistrict)
merchRoute.post('/login',validateLogin,controller.merchant.login)
merchRoute.post('/register',validateRegister,controller.merchant.register)

module.exports = merchRoute