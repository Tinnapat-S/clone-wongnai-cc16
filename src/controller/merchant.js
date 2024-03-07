const repo = require("../repository")
const utils = require("../utils")
const { CustomError } = require("../config/error")
const { Role } = require("@prisma/client")
const { catchError } = require("../utils/catch-error")
const { uploadCloudinary } = require("../services/upload-cloudinary")

const fs = require("fs/promises")
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

// exports.getCodeByName = catchError(
//     async (req, res, next) => {
//         const
//     }
// )
