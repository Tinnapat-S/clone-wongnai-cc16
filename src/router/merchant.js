const express = require("express")
const controller = require("../controller")
const upload = require("../middlewares/upload")

const merchRoute = express.Router()

merchRoute.get("/province", controller.merchant.getProvince)
merchRoute.post("/district", controller.merchant.getDistrict)
merchRoute.post("/sub-district", controller.merchant.getSubDistrict)

merchRoute.post("/menu", upload.single("img"), controller.merchant.createMenu)
merchRoute.delete("/menu/:id", controller.merchant.deleteMenu)
merchRoute.patch("/menu/:id", controller.merchant.updateMenu)
merchRoute.patch("/menu-img/:id", upload.single("img"), controller.merchant.updateMenuImg)

module.exports = merchRoute
