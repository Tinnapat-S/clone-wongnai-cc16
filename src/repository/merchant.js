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

exports.getBusinessInfoBYMerchantId = () => prisma.$queryRaw`
SELECT 
 *
FROM
    restaurants
        JOIN
    facilities_with_restaurant_id ON restaurants.id = facilities_with_restaurant_id.restaurantId
    JOIN
    open_hours on open_hours.restaurant_id = restaurants.id
WHERE
    restaurants.id = 1
`
exports.getBusinessInfoBYMerchantId = (id) => prisma.restaurant.findUnique({
  where: { id },
  include: { facilitiesWithRestaurantId: true, openHours: true }

})
exports.createMenu = (data) => prisma.menu.create({ data })
