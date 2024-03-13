const repo = require("../repository")
const utils = require("../utils")
const { CustomError } = require("../config/error")
const { Role } = require("@prisma/client")
const { catchError } = require("../utils/catch-error")
const { uploadCloudinary } = require("../services/upload-cloudinary")
const fs = require("fs/promises")
const { createError } = require("../utils/creat-error")
const { getBusinessInfoBYMerchantId, toggleClose, toggleOpen, editRestaurantInfo, deleteOpenHour } = require("../repository/merchant")
const { getRestaurantById } = require("./restaurants")
const { response } = require("express")

module.exports.getMe = async (req, res, next) => {
    try {
        const restaurant = await repo.merchant.getAllRestaurantByMerchantId(req.merchant.id)
        res.status(200).json({ restaurant })
    } catch (err) {
        console.log(err)
        next(err)
    }
}

module.exports.getAll = async (req, res, next) => {
    try {
        res.status(200).json({ message: "testpass" })
        const users = await repo.user.getAll()
        res.status(200).json({ users })
    } catch (err) {
        next(err)
    }
    return
}

exports.getProvince = catchError(async (req, res, next) => {
    const province = await repo.merchant.getProvince()
    res.status(200).json({ province })
})

exports.getDistrict = catchError(async (req, res, next) => {
    const { provinceCode } = req.body
    console.log(req.body)
    const district = await repo.merchant.getDistrict(provinceCode)
    console.log(district)
    res.status(200).json({ district })
})

exports.getSubDistrict = catchError(async (req, res, next) => {
    const { districtCode } = req.body
    console.log(req.body)
    const subDistrict = await repo.merchant.getSubDistrict(districtCode)
    console.log(subDistrict)
    res.status(200).json({ subDistrict })
})
exports.getMenu = catchError(async (req, res, next) => {
    const { restaurantId } = req.params
    const data = await repo.merchant.getMenuByRestaurantId(+restaurantId)
    res.status(200).json({ data })
})

exports.createMenu = catchError(async (req, res, next) => {
    req.body.img = await uploadCloudinary(req.file.path)
    fs.unlink(req.file.path)
    req.body.restaurantId = +req.body.restaurantId
    req.body.price = +req.body.price
    const data = await repo.merchant.createMenu(req.body)
    res.status(200).json({ data })
})
exports.deleteMenu = catchError(async (req, res, next) => {
    const { id } = req.params
    console.log(id, "************")
    const data = await repo.merchant.deleteMenu(+id)
    res.status(201).json({ message: "seccess", data })
})
exports.updateMenu = catchError(async (req, res, next) => {
    const { id } = req.params
    const data = await repo.merchant.updateMenu(+id, req.body)
    res.status(200).json({ data })
})
exports.updateMenuImg = catchError(async (req, res, next) => {
    const { id } = req.params
    req.body.img = await uploadCloudinary(req.file.path)
    fs.unlink(req.file.path)
    const data = await repo.merchant.updateMenuImg(+id, req.body.img)
    res.status(200).json({ data })
})

module.exports.register = async (req, res, next) => {
    try {
        const { name, username, mobile, password, confirmPassword } = req.body
        console.log(req.body)
        // console.log(req.files.imgProfile[0].path)

        const existsUser = await repo.merchant.findUserByUsernameOrMobile(req.body.username || req.body.mobile)

        if (existsUser) {
            throw new CustomError("USERNAME_OR_MOBILE_IN_USE", 400)
        }
        // console.log(req.body)
        delete req.body.confirmPassword
        // HASHED PASSWORD
        const hashed = await utils.bcrypt.hashed(password)
        console.log(hashed)
        // CREATE user to database
        const merchant = await repo.merchant.createUser({ ...req.body, password: hashed })
        // DELETE KEY of password from merchant data
        delete merchant.password
        delete merchant.createdAt
        merchant.role = "RESTAURANT"
        // SIGN token from merchant data
        // console.log(merchant)
        console.log(merchant)
        const token = utils.jwt.sign({ merchantId: merchant.id, role: "MERCHANT" })

        res.status(200).json({ token, merchant })
    } catch (err) {
        console.log(err)
        next(err)
    }
    return
}
exports.login = catchError(async (req, res, next) => {
    const existsUser = await repo.merchant.findUserByUsernameOrMobile(req.body.usernameOrMobile)

    if (!existsUser) {
        createError("invalid credentials", 400)
    }
    // const isMatch = await repo.merchant.findPassWordTest(
    //     req.body.password
    // )
    const isMatch = await utils.bcrypt.compare(req.body.password, existsUser.password)

    if (!isMatch) {
        createError("invalid credentials", 400)
    }

    const payload = { userId: existsUser.id, role: "MERCHANT" }
    const accessToken = utils.jwt.sign(payload)
    delete existsUser.password
    existsUser.role = "RESTAURANT"

    res.status(200).json({ accessToken, merchant: existsUser })
})

exports.getGeoDataByName = catchError(async (req, res, next) => {
    const { province, district, subdistrict } = req.body
    console.log(province, district)
    const provinceData = await repo.merchant.getProvinceByName(province)
    const districtData = await repo.merchant.getDistrictByName(district)
    const subDistrictData = await repo.merchant.getSubDistrictByName(subdistrict)

    res.status(200).json({ provinceData, districtData, subDistrictData })
})

exports.getCategory = catchError(async (req, res, next) => {
    const categories = await repo.categories.getAll()
    res.status(200).json({ categories })
})

exports.createRestaurant = catchError(async (req, res, next) => {
    const { resData, openHours, facility } = req.body

    resData.subDistrictCode = resData.subdistrictCode
    resData.lat = resData.lat + ""
    resData.lng = resData.lng + ""
    delete resData.subdistrictCode
    const newRestaurant = await repo.merchant.createRestaurant(resData)

    const newOpenHour = Object.fromEntries(
        Object.entries(openHours).filter(async ([day, time]) => {
            if (time.closed === false) {
                const data = {
                    restaurantId: newRestaurant.id,
                    date: day,
                    openTime: new Date(`2024-02-02T` + time.open),
                    closeTime: new Date(`2024-02-02T` + time.close),
                }

                console.log(data)
                await repo.merchant.createOpenHours(data)
            }
        }),
    )

    console.log(facility)

    for (const key in facility) {
        if (Object.hasOwnProperty.call(facility, key)) {
            const element = facility[key]
            if (facility[key].value === true) {
                const data = {
                    restaurantId: newRestaurant.id,
                    facilityId: element.id,
                }

                console.log(element)
                await repo.merchant.createFacility(data)
            }
        }
    }

    res.status(200).json({ newRestaurant })
})

exports.getBusinessInfo = catchError(async (req, res, next) => {
    const { restaurantId } = req.body
    const restaurant = await getBusinessInfoBYMerchantId(restaurantId)
    // console.log(restaurant);
    const { id, isOpen, reviewCount, reviewPoint, verify, profileImg, subDistrictCode, rating, ...restaurantInfo } = restaurant
    // delete restaurant.isOpen, restaurant.reviewCount, restaurant.reviewPoint, restaurant.verify, restaurant.profileImg, restaurant.subDistrictCode
    res.status(200).json({ restaurantInfo })
})

exports.toggleOpen = catchError(async (req, res, next) => {
    const { id } = req.params

    const restaurant = await repo.restaurants.getRestaurantById(+id)
    console.log(restaurant)
    console.log(restaurant.isOpen)
    if (!restaurant.isOpen) {
        const data = await toggleOpen(+id)
        res.status(200).json({ data })
        return
    }
    const data = await toggleClose(+id)
    res.status(200).json({ data })
})

exports.updateRestaurant = catchError(async (req, res, next) => {
    const { restaurantId, newData, openingHours, facility } = req.body

    newData.subDistrictCode = newData.subdistrictCode
    newData.lat = newData.lat + ""
    newData.lng = newData.lng + ""
    delete newData.subdistrictCode

    const updatedRestaurant = await editRestaurantInfo(+restaurantId, newData)

    await repo.merchant.deleteOpenHour(+restaurantId)

    Object.fromEntries(
        Object.entries(openingHours).filter(async ([day, time]) => {
            if (time.closed === false) {
                const data = {
                    restaurantId: +restaurantId,
                    date: day,
                    openTime: new Date(`2024-02-02T` + time.open),
                    closeTime: new Date(`2024-02-02T` + time.close),
                }

                console.log(data)
                await repo.merchant.createOpenHours(data)
            }
        }),
    )
    await repo.merchant.deleteFacility(+restaurantId)

    for (const key in facility) {
        if (Object.hasOwnProperty.call(facility, key)) {
            const element = facility[key]
            if (facility[key].value === true) {
                const data = {
                    restaurantId: +restaurantId,
                    facilityId: element.id,
                }

                console.log(element)
                await repo.merchant.createFacility(data)
            }

            console.log(element)
            // await repo.merchant.updateFacility(+restaurantId, data)
        }
    }

    res.status(200).json({ updatedRestaurant })
})

exports.getSideBar = catchError(async (req, res, next) => {
    const { id } = req.params
    const data = await repo.restaurants.getSideBar(+id)
    res.status(200).json({ data })
})

exports.getMerchant = catchError(async (req, res, next) => {
    delete req.merchant.password
    res.status(200).json({ merchant: req.merchant })
})

exports.getChatBox = catchError(async (req, res, next) => {
    const data = await repo.merchant.getChatBox(+req.params.restaurantId)
    res.status(200).json({ data })
})
