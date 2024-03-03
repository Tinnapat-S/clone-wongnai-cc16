const prisma = require("../config/prisma")

module.exports.getAll = async () => await prisma.category.findMany()
