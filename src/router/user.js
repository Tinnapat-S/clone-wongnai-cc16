const express = require("express")

const c = require("../controller")
const authenticate = require("../middlewares/authenticate")
const { validateRegister } = require("../middlewares/validators/validate-auth")
const upload = require("../middlewares/upload")
const { isOwn } = require("../middlewares/isOwn")

const userRoute = express.Router()

userRoute.get("/", c.user.getAll)
userRoute.get("/me", authenticate, c.user.getMe) // //
userRoute.get("/:id", c.user.get) // ไม่ต้อง authen เพราะว่่าเข้าไปดูได้ทุกคน
userRoute.post("/register", upload.fields([{ name: "imgProfile", maxCount: 1 }]), validateRegister, c.user.register) // //
// userRoute.post("/register", validateRegister, c.user.register) //
userRoute.post("/loginWithFace", c.user.registerFacebook) // register ได้เฉพาะของฮั่นตอนนี้

userRoute.post("/loginWithGoogle", c.user.registerGoogle) // //

userRoute.patch("/password", authenticate, c.user.updatePassword) //
userRoute.post("/login", c.user.login) // //
userRoute.patch("/", authenticate, isOwn, c.user.update) //
userRoute.patch("/user-img", authenticate, upload.fields([{ name: "imgProfile", maxCount: 1 }]), isOwn, c.user.updateProfile) //
userRoute.delete("/:id", authenticate, c.user.delete)
userRoute.post("/review", authenticate, upload.fields([{ name: "img" }]), c.user.createReview)
userRoute.patch("/review", authenticate, c.user.updateReview)
userRoute.delete("/review/:id", authenticate, c.user.deleteReview)
userRoute.patch("/review-img", authenticate, upload.fields([{ name: "img" }]), c.user.updateReviewImg)

//bookmark
userRoute.post("/bookmark", authenticate, c.bookmarks.toggleBookmark)
userRoute.get("/bookmark/:id", authenticate, c.user.getBookmark)

module.exports = userRoute
