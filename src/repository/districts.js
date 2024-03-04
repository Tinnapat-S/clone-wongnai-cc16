const prisma = require("../config/prisma")

module.exports.getBangkokDistricts = async () => await prisma.district.findMany({ where: { provinceCode: 10 } })
