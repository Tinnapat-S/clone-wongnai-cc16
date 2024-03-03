const prisma = require("../config/prisma")
exports.getBookmarkByUserId = async (userId) => {
    const bookmark = await prisma.bookmark.findMany({ where: { userId } })
    return bookmark
}
