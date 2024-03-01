const express = require("express")

const c = require("../controller")
const authenticate = require("../middlewares/authenticate")

const restaurantRoute = express.Router()

restaurantRoute.get("/", c.restaurants.getAll)

module.exports = restaurantRoute
