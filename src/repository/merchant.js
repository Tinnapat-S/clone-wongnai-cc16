const prisma = require("../models/prisma")
// const { catchError } = require('../utils/catch-error')

exports.getAllProvince = () => prisma.province.findMany(    // { where: { id: 1 } }
)

exports.getAllDistrict = (provinceCode) => prisma.district.findMany({ where: { provinceCode } })
exports.getSubDistrict = (districtCode) => prisma.subDistrict.findMany({ where: { districtCode } })

exports.getProvinceByName = (provinceName) =>
    prisma.province.findFirst({
        where: {
            OR: [{ provinceNameEn: provinceName }, { provinceNameTh: provinceName }]
        }
    })

exports.getDistrictByName = (districtName) =>
    prisma.district.findFirst({
        where: { OR: [{ districtNameEn: districtName }, { districtNameTh: districtName }] }
    })

exports.getSubDistrictByName = (subdistrictName) =>
    prisma.subDistrict.findFirst({
        where: { OR: [{ subdistrictNameEn: subdistrictName }, { subdistrictNameTh: subdistrictName }] }
    })


exports.getGeoDataByPostCode = (postalCode) => prisma.subDistrict.findMany({ where: { postalCode } })

exports.createRestaurant = (data) => prisma.restaurant.create({ data })

exports.createOpenHours = (openHours) => prisma.openHours.createMany({
    data: { openHours }
})

