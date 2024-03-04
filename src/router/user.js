const express = require("express")

const c = require("../controller")
const authenticate = require("../middlewares/authenticate")
const { validateRegister } = require("../middlewares/validators/validate-auth")
const upload = require("../middlewares/upload")

const userRoute = express.Router()

userRoute.get("/", c.user.getAll)
userRoute.get("/me", authenticate, c.user.getMe) //
userRoute.get("/:id", authenticate, c.user.get)
userRoute.post("/register", upload.fields([{ name: "imgProfile", maxCount: 1 }]), validateRegister, c.user.register) //
// userRoute.post("/register", validateRegister, c.user.register) //
userRoute.post("/loginWithFace", c.user.registerFacebook) //
userRoute.post("/login", c.user.login) //
userRoute.put("/:id", c.user.update)
userRoute.delete("/:id", authenticate, c.user.delete)
userRoute.post("/createReview",c.user.createReview)

module.exports = userRoute
