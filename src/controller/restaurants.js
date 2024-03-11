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

        const { districtId, facilityId, rating, priceLength, categoryId } = filterData

        if (districtId || facilityId || rating || priceLength || categoryId) {
            const filterConditions = []
            if (districtId) {
                const getDistricts = districtId.map((id) => ({ id: parseInt(id) }))
                const districts = await prisma.district.findMany({ where: { OR: getDistricts } })

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

            if (rating) {
                //rating is only 1 values in array
                const ratingInt = parseInt(rating[0])
                filterConditions.push({ reviewPoint: { in: [ratingInt] } })
            }
            if (priceLength) {
                // const getPrice = priceLength.map((id) => ({ priceLength: id }))
                filterConditions.push({ priceLength: { in: priceLength } })
            }

            // test == [{districtCode: 1001},{districtCode: 1002},{rating: 1},{priceLength: "฿฿฿"}]
            const restaurants = await repo.restaurants.getFilter(filterConditions, facilityIds, req.user?.id) // id change

            res.status(200).json({ restaurants })
        }
    } catch (err) {
        console.log(err, "here err")
        next(err)
    }
}

module.exports.getRestaurantById = async (req, res, next) => {
    try {
        const { id } = req.params
        const restaurant = await repo.restaurants.getRestaurantById(parseInt(id))
        res.status(200).json({ restaurant })
    } catch (err) {
        next(err)
    }
}

module.exports.getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params
        const category = await repo.restaurants.getCategoryById(parseInt(id))
        res.status(200).json({ category })
    } catch (err) {
        next(err)
    }
}
