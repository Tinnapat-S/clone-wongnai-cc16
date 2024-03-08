const prisma = require("../config/prisma")

// =========================================== BASIC CRUD ===================================
module.exports.get = async (where) => await prisma.restaurant.findUnique({ where })
module.exports.getAll = async () =>
    await prisma.restaurant.findMany({
        include: {
            restaurantImages: { select: { id: true, img: true } },
            category: { select: { categoryName: true } },
        },
    })

module.exports.getFilter = async (filterConditions, facilityId) =>
    await prisma.restaurant.findMany({
        where: {
            AND: [
                ...filterConditions,
                facilityId
                    ? {
                          facilitiesWithRestaurantId: {
                              some: {
                                  facilityId: {
                                      in: facilityId,
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

module.exports.getRestaurantsBookmarkByUserId = async (userId) =>
    await prisma.restaurant.findMany({
        include: {
            restaurantImages: { select: { id: true, img: true } },
            category: { select: { categoryName: true } },
            bookmarks: { where: { userId } },
        },
    })

exports.getRestaurantById = async (id) => {
    return await prisma.restaurant.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            category: { select: { categoryName: true } },
        },
    })
}
