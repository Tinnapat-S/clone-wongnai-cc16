const repo = require("../repository")
const utils = require("../utils")
const { CustomError } = require("../config/error")
const { Role } = require("@prisma/client")
const { district } = require("../config/prisma")
const prisma = require("../config/prisma")

module.exports.getAll = async (req, res, next) => {
    try {
        const restaurants = await repo.restaurants.getAll()
        const districts = await repo.districts.getBangkokDistricts()
        const facilities = await repo.facilities.getAll()
        const categories = await repo.categories.getAll()

        res.status(200).json({ restaurants, districts, facilities, categories })
    } catch (err) {
        next(err)
    }
    return
}

module.exports.getRestaurantsWithUser = async (req, res, next) => {
    try {
        if (!req.user) throw new CustomError("Not found user", "WRONG_INPUT", 400)

        const restaurants = await repo.restaurants.getRestaurantsBookmarkByUserId(req.user.id)

        res.status(200).json({ restaurants })
    } catch (err) {
        next(err)
    }
    return
}

module.exports.getFilter = async (req, res, next) => {
    try {
        const filterData = req.query
        console.log(filterData, "params")
        //check params if not exist {} be return

        if (Object.keys(filterData)?.length == 0) {
            throw new CustomError("No filter", "400_BAD_REQUEST", 400)
        }
        const { districtId, facilityId, rating, priceLength, categoryId } = filterData

        if (districtId || facilityId || rating || priceLength || categoryId) {
            const filterConditions = []
            if (districtId) {
                const getDistricts = districtId.map((id) => ({ id: parseInt(id) }))
                const districts = await prisma.district.findMany({ where: { OR: getDistricts } })
                // console.log(districts, "test")
                const districtCodes = districts.map((district) => district.districtCode)
                //[1001,1003] //พระนคร หนองจอก
                filterConditions.push({ districtCode: { in: districtCodes } })
            }
            if (categoryId) {
                const getCategories = categoryId.map((id) => parseInt(id))
                //[{categoryId:1},{categoryId:2}]
                filterConditions.push({ categoryId: { in: getCategories } })
            }

            const facilityIds = facilityId ? facilityId.map((id) => parseInt(id)) : null
            // if (facilityId) {
            //     const facilityIds = facilityId.map((id) => parseInt(id))
            // const restaurants = await prisma.restaurant.findMany({
            //     where: {
            //         facilitiesWithRestaurantId: {
            //             some: {
            //                 facilityId: {
            //                     in: facilityIds,
            //                 },
            //             },
            //         },
            //     },
            // })
            // console.log(restaurants)

            // }

            // if (facilityId) {
            //     const getFacilitiesInt = facilityId.map((id) => ({ facilityId: parseInt(id) }))
            //     //getFacilitiesInt == [{facilityId: 1},{facilityId: 2}]
            //     console.log(getFacilitiesInt, "check")
            //     const facilities = await prisma.facilityWithRestaurantId.findMany({
            //         where: { AND: getFacilitiesInt },
            //         include: { facility: true, restaurant: true },
            //     })
            //     const test = facilities.map((facilities) => ({
            //         facility: facilities.facility.facilityName,
            //         restaurant: facilities.restaurant,
            //     }))
            //     filterConditions.push(...test)
            // }

            if (rating) {
                //rating is only 1 values in array
                const ratingInt = parseInt(rating[0])
                filterConditions.push({ reviewPoint: { in: [ratingInt] } })
            }
            if (priceLength) {
                // const getPrice = priceLength.map((id) => ({ priceLength: id }))
                filterConditions.push({ priceLength: { in: priceLength } })
            }
            console.log(filterConditions, "filterConditions")
            ///////////test
            // test == [{districtCode: 1001},{districtCode: 1002},{rating: 1},{priceLength: "฿฿฿"}]
            const restaurants = await prisma.restaurant.findMany({
                where: {
                    AND: [
                        ...filterConditions,
                        facilityId
                            ? {
                                  facilitiesWithRestaurantId: {
                                      some: {
                                          facilityId: {
                                              in: facilityIds,
                                          },
                                      },
                                  },
                              }
                            : null,
                    ].filter(Boolean),
                },
                include: {
                    restaurantImages: { select: { id: true, img: true } },
                    category: { select: { categoryName: true } },
                },
            })
            console.log(restaurants)
            return res.status(200).json({ restaurants })
            //raw
            // const restaurants =
            //     await prisma.$queryRaw`select r.id, restaurant_name, merchant_id, r.subtitle, lat,lng, review_point,review_count,verify,is_open,mobile,email,address,district_id,price_length,category_id from restaurants r inner join facilities_with_restaurant_id fr on r.id = fr.restaurantId inner join facilities f on fr.facility_id = f.id inner join districts d on r.district_id = d.district_code where r.review_point = 1 or r.price_length = "฿฿฿"
            // group by r.id;`
        }
        // return res.status(400).json({ restaurant: [] })

        //const restaurants = await repo.restaurants.getFilter(params)
    } catch (err) {
        console.log(err)
        next(err)
    }
}
