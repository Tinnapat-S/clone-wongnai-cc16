const repo = require("../repository")
const utils = require("../utils")
const { CustomError } = require("../config/error")
const { Role } = require("@prisma/client")
module.exports.getAll = async (req, res, next) => {
    try {
        const restaurants = await repo.restaurants.getAll()
        const restaurantsWithRating = restaurants.map((restaurant) => {
            if (restaurant.reviewCount == 0 || restaurant.reviewPoint == 0) {
                return { ...restaurant, rating: 0 }
            } else {
                return { ...restaurant, rating: restaurant.reviewPoint / restaurant.reviewPoint }
            }
        })
        const districts = await repo.districts.getBangkokDistricts()
        const facilities = await repo.facilities.getAll()
        // console.log(districts)
        res.status(200).json({ restaurants: restaurantsWithRating, districts, facilities })
    } catch (err) {
        next(err)
    }
    return
}
