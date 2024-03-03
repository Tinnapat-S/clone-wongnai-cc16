const repo = require("../repository")
module.exports.toggleBookmark = async (req, res, next) => {
    try {
        console.log("pass")
        const { restaurantId } = req.body
        const bookmarkExist = await repo.user.getBookmark({ userId: req.user.id, restaurantId })
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