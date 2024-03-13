const { facilities } = require(".")
const { execute } = require("../db")
const prisma = require("../models/prisma")
// const { catchError } = require('../utils/catch-error')

exports.findUserByUsernameOrMobile = (usernameOrMobile) =>
    prisma.merchant.findFirst({
        where: {
            OR: [{ username: usernameOrMobile }, { mobile: usernameOrMobile }],
        },
    })

exports.findPassWordTest = async (password) => {
    const merchant = await prisma.merchant.findFirst({
        where: {
            OR: [
                {
                    password: password,
                },
            ],
        },
    })

    return merchant
}
exports.deleteMenu = (id) => prisma.menu.delete({ where: { id } })

exports.createUser = (data) => prisma.merchant.create({ data })
exports.findUserById = (id) => prisma.merchant.findUnique({ where: { id } })
// module.exports.get = async (username) =>
//     await prisma.merchant.findFirst({
//         where: {
//             OR: [{ username: username }, { mobile: username }],
//         },
//     })

exports.getMenuByRestaurantId = (restaurantId) => prisma.menu.findMany({ where: { restaurantId } })

exports.getProvince = () =>
    prisma.province
        .findMany
        // { where: { id: 1 } }
        ()

exports.getDistrict = (provinceCode) => prisma.district.findMany({ where: { provinceCode } })
exports.getAllProvince = () =>
    prisma.province
        .findMany // { where: { id: 1 } }
        ()

exports.getAllDistrict = (provinceCode) => prisma.district.findMany({ where: { provinceCode } })
exports.getSubDistrict = (districtCode) => prisma.subDistrict.findMany({ where: { districtCode } })

exports.getProvinceByName = (provinceName) =>
    prisma.province.findFirst({
        where: {
            OR: [{ provinceNameEn: provinceName }, { provinceNameTh: provinceName }],
        },
    })

exports.getDistrictByName = (districtName) =>
    prisma.district.findFirst({
        where: { OR: [{ districtNameEn: districtName }, { districtNameTh: districtName }] },
    })

exports.getSubDistrictByName = (subdistrictName) =>
    prisma.subDistrict.findFirst({
        where: { OR: [{ subdistrictNameEn: subdistrictName }, { subdistrictNameTh: subdistrictName }] },
    })

exports.getGeoDataByPostCode = (postalCode) => prisma.subDistrict.findMany({ where: { postalCode } })

exports.createRestaurant = (data) => prisma.restaurant.create({ data })

exports.createOpenHours = (data) => prisma.openHours.create({ data })

exports.createFacility = (data) => prisma.facilityWithRestaurantId.create({ data })

exports.getBusinessInfoBYMerchantId = (id) =>
    prisma.restaurant.findUnique({
        where: { id },
        include: { facilitiesWithRestaurantId: true, openHours: true },
    })
exports.createMenu = (data) => prisma.menu.create({ data })

exports.toggleOpen = (id) =>
    prisma.restaurant.update({
        where: { id },
        data: { isOpen: true },
    })
exports.toggleClose = (id) => prisma.restaurant.update({ where: { id }, data: { isOpen: false } })

exports.editRestaurantInfo = (id, data) => prisma.restaurant.update({ where: { id }, data })

exports.deleteFacility = (restaurantId) => prisma.facilityWithRestaurantId.deleteMany({ where: { restaurantId } })

exports.deleteOpenHour = (restaurantId) => prisma.openHours.deleteMany({ where: { restaurantId } })

exports.updateFacility = (id, data) => prisma.facilityWithRestaurantId.update({ where: { id }, data })

exports.getAllRestaurantByMerchantId = (id) =>
    prisma.restaurant.findMany({
        where: { merchantId: id },
        include: {
            openHours: true,
            category: true,
            restaurantImages: true,
            facilitiesWithRestaurantId: { include: { facility: true } },
            reviews: true,
        },
    })

exports.getChatBox = async (restaurantId) => {
    const sql = `select u.id userId, r.id restaurantId , u.name, u.img_profile
    from Chat c inner join users u on c.user_id = u.id inner join restaurants r on c.restaurant_id = r.id  
    where r.id = ?
    group by u.id, r.id ;`
    const value = [restaurantId]
    const data = await execute(sql, value)
    return data
}
