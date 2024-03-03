const express = require("express")

const c = require("../controller")
const authenticate = require("../middlewares/authenticate")

const restaurantRoute = express.Router()

restaurantRoute.get("/", c.restaurants.getAll)
restaurantRoute.get("/filter?", c.restaurants.getFilter)
restaurantRoute.get("/bookmark", authenticate, c.restaurants.getRestaurantsWithUser)

module.exports = restaurantRoute
