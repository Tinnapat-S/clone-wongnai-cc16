const prisma = require('../models/prisma')
// const { catchError } = require('../utils/catch-error')

exports.getProvince = () => prisma.province.findMany(
    // { where: { id: 1 } }
)

exports.getDistrict = (provinceCode) => prisma.district.findMany({ where: { provinceCode } })

exports.getSubDistrict = (districtCode) => prisma.subDistrict.findMany({ where: { districtCode } })

// exports.getCodeByName = (provinceName) => prisma.district.findFirst({
//     where: {
//         OR: [
//             { provinceNameEn: provinceName },
//             { provinceNameTh: provinceName },
//         ]
//     }
// })

