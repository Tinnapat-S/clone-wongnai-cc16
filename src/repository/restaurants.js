const prisma = require("../config/prisma")

// =========================================== BASIC CRUD ===================================
module.exports.get = async (where) => await prisma.restaurant.findUnique({ where })
module.exports.getAll = async () =>
    await prisma.restaurant.findMany({
        include: {
            restaurantImages: { select: { id: true, img: true } },
            category: { select: { categoryName: true } },
            reviews: true,
        },
    })

module.exports.reviewPoint = (id, point) =>
    prisma.restaurant.update({
        where: { id },
        data: { reviewPoint: { increment: point }, reviewCount: { increment: 1 } },
    })
module.exports.find = (id) => prisma.restaurant.findFirst({ where: { id } })

module.exports.updateRating = (id, rating) => prisma.restaurant.update({ where: { id }, data: { rating } })

module.exports.updataReviewPointReviewCount = (id, reviewPoint, rating) =>
    prisma.restaurant.update({ where: { id }, data: { reviewPoint, rating, reviewCount: { decrement: 1 } } })
// module.exports.getFilterWithUserId = async (filterConditions, facilityId, userId) =>
//     await prisma.restaurant.findMany({
//         where: {
//             AND: [
//                 ...filterConditions,
//                 facilityId
//                     ? {
//                           facilitiesWithRestaurantId: {
//                               some: {
//                                   facilityId: {
//                                       in: facilityId,
//                                   },
//                               },
//                           },
//                       }
//                     : null,
//             ].filter(Boolean),
//         },
//         include: {
//             restaurantImages: { select: { id: true, img: true } },
//             category: { select: { categoryName: true } },
//             bookmarks: { where: { userId } },
//         },
//     })

module.exports.getFilter = async (filterConditions, facilityId, userId) =>
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
            bookmarks: userId ? { where: { userId } } : false,
            reviews: true,
        },
    })

module.exports.getRestaurantsBookmarkByUserId = async (userId) =>
    await prisma.restaurant.findMany({
        include: {
            restaurantImages: { select: { id: true, img: true } },
            category: { select: { categoryName: true } },
            bookmarks: { where: { userId } },
            reviews: true,
        },
    })

module.exports.getRestaurantById = async (id) =>
    await prisma.restaurant.findUnique({
        where: { id },
        include: {
            restaurantImages: { select: { id: true, img: true } },
            category: { select: { categoryName: true } },
            openHours: true,
            facilitiesWithRestaurantId: {
                include: {
                    facility: { select: { facilityName: true } },
                },
            },
            reviews: {
                include: {
                    user: true,
                },
            },
        },
    })

module.exports.getCategoryById = async (id) =>
    await prisma.category.findMany({
        // where: { id },
        include: {
            restaurants: true,
        },
    })

module.exports.uploadImg = (data) =>
    prisma.restaurantImage.createMany({
        data,
    })
module.exports.restaurantImg = (restaurantId) =>
    prisma.restaurantImage.findMany({
        where: { restaurantId },
    })

module.exports.deleteRestaurantImg = (id) =>
    prisma.restaurantImage.delete({
        where: { id },
    })
