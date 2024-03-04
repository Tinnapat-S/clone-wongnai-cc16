const express = require("express")
const controller = require("../controller")

const merchRoute = express.Router()

merchRoute.get('/province', controller.merchant.getProvince)
merchRoute.post('/district', controller.merchant.getDistrict)
merchRoute.post('/sub-district', controller.merchant.getSubDistrict)

module.exports = merchRoute