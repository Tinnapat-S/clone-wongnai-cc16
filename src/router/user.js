const express = require("express")

const c = require("../controller")
const authenticate = require("../middlewares/authenticate")

const userRoute = express.Router()

userRoute.get("/", c.user.getAll)
userRoute.get("/:id", c.user.get)
userRoute.post("/register", c.user.register)
userRoute.post("/login", c.user.login)
userRoute.put("/:id", c.user.update)
userRoute.delete("/:id", authenticate, c.user.delete)

module.exports = userRoute
