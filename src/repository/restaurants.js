const prisma = require("../config/prisma")

// =========================================== BASIC CRUD ===================================
module.exports.get = async (where) => await prisma.restaurant.findUnique({ where })
module.exports.getAll = async () =>
    await prisma.restaurant.findMany({
        include: { restaurantImages: { select: { id: true, img: true } }, category: { select: { categoryName: true } } },
    })

module.exports.getFilter = async (where) =>
    await prisma.restaurant.findMany({
        where: where,
        include: { restaurantImages: { select: { id: true, img: true } }, category: { select: { categoryName: true } } },
    })
