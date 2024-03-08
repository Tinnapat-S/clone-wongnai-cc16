const express = require("express")

const c = require("../controller")
const authenticate = require("../middlewares/authenticate")
const getUser = require("../middlewares/getUser")

const restaurantRoute = express.Router()

restaurantRoute.get("/", c.restaurants.getAll)
restaurantRoute.get("/filter?", getUser, c.restaurants.getFilter)
restaurantRoute.get("/bookmark", authenticate, c.restaurants.getRestaurantsWithUser)
restaurantRoute.get("/:id", c.restaurants.getRestaurantById)

module.exports = restaurantRoute
