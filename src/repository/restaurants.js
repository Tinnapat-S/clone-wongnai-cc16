const prisma = require("../config/prisma")

// =========================================== BASIC CRUD ===================================
module.exports.get = async (where) => await prisma.restaurant.findUnique({ where })
module.exports.getAll = async () =>
    await prisma.restaurant.findMany({
        include: { restaurantImages: { select: { id: true, img: true } }, category: { select: { categoryName: true } } },
    })
module.exports.create = async (data) => await prisma.restaurant.create({ data })
module.exports.update = async ({ id }, data) => await prisma.restaurant.update({ where: { id }, data })
module.exports.delete = async ({ id }) => await prisma.restaurant.delete({ where: { id } })