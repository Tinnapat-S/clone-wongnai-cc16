const repo = require("../repository")
module.exports.toggleBookmark = async (req, res, next) => {
    try {
        const { restaurantId } = req.body
        console.log("restaurantId", restaurantId)

        console.log("req.user.id", req.user.id)
        const bookmarkExist = await repo.user.getBookmark({ userId: req.user.id, restaurantId })
        console.log("bookmarkExist", bookmarkExist)
        if (bookmarkExist) {
            await repo.user.deleteBookmark(bookmarkExist.id)
            return res.status(200).json({ bookmark: false })
        } else {
            await repo.user.createBookmark({ userId: req.user.id, restaurantId })
            return res.status(200).json({ bookmark: true })
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
    return
}
