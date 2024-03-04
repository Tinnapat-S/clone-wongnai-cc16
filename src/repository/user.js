const prisma = require("../config/prisma")

// =========================================== BASIC CRUD ===================================
module.exports.get = async (username) =>
    await prisma.user.findFirst({
        where: {
            OR: [{ email: username }, { mobile: username }],
        },
    })
module.exports.getAll = async () => await prisma.user.findMany()
module.exports.create = async (data) => await prisma.user.create({ data })
module.exports.update = async ({ id }, data) => await prisma.user.update({ where: { id }, data })
module.exports.delete = async ({ id }) => await prisma.user.delete({ where: { id } })

// =========================================== CUSTOM REPOSITORY ===================================
module.exports.emailIsDuplicate = async (email) => await prisma.user.findFirst({ where: { email } })
module.exports.mobileIsDupplicate = async (mobile) => await prisma.user.findFirst({ where: { mobile } })

module.exports.getMe = () => {}

module.exports.findUserFacebook = async (facebookId) => await prisma.user.findFirst({ where: { facebookId } })
module.exports.createUserLoginWithFacebook = async ({ facebookId, name }) => await prisma.user.create({ data: { facebookId, name } })

module.exports.userGetProfile = async (id) => await prisma.user.findFirst({ where: { id } })

module.exports.createReview = async (data) =>
    await prisma.review.create({
        data: {
            userId: data.userId,
            restaurantId: data.restaurantId,
            star: data.star,
            title: data.title,
            description: data.description,
            reviewImgs: { createMany: { data: [{ img: "asdf" }, { img: "asdf" }] } },
        },
    })
