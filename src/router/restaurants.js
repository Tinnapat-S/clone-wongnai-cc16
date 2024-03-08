const express = require("express")

const c = require("../controller")
const authenticate = require("../middlewares/authenticate")
const getUser = require("../middlewares/getUser")
const upload = require("../middlewares/upload")

const restaurantRoute = express.Router()

restaurantRoute.get("/", c.restaurants.getAll)
restaurantRoute.get("/filter?", getUser, c.restaurants.getFilter)
restaurantRoute.get("/bookmark", authenticate, c.restaurants.getRestaurantsWithUser)
restaurantRoute.get("/:id", c.restaurants.getRestaurantById)
restaurantRoute.post("/Img/:restaurantId", upload.fields([{ name: "img" }]), c.restaurants.uploadRestaurantImg)
restaurantRoute.delete("/Img/:id", c.restaurants.deleteRestaurantImg)

// restaurantRoute.get("/:id/review", c.reviews.getReviewByRestaurantId)

module.exports = restaurantRoute
