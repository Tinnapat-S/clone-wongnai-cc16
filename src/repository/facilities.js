const prisma = require("../config/prisma")

module.exports.getAll = async () => await prisma.facility.findMany()
