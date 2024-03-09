const repo = require("../repository")
const utils = require("../utils")
const { CustomError } = require("../config/error")
const { Role } = require("@prisma/client")
const { catchError } = require("../utils/catch-error")
const { uploadCloudinary } = require("../services/upload-cloudinary")

const fs = require("fs/promises")
const { time, log } = require("console")
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


exports.getProvince = catchError(
    async (req, res, next) => {
        const province = await repo.merchant.getAllProvince()
        res.status(200).json({ province })
    }
)

exports.getDistrict = catchError(async (req, res, next) => {
    const { provinceCode } = req.body
    console.log(req.body)
    const district = await repo.merchant.getDistrict(provinceCode)
    console.log(district)
    res.status(200).json({ district })
})
exports.getDistrict = catchError(
    async (req, res, next) => {
        const { provinceCode } = req.body
        console.log(req.body);
        const district = await repo.merchant.getAllDistrict(provinceCode)
        console.log(district);
        res.status(200).json({ district })

    }
)

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

exports.getSubDistrict = catchError(
    async (req, res, next) => {
        const { districtCode } = req.body
        console.log(req.body);
        const subDistrict = await repo.merchant.getSubDistrict(districtCode)
        console.log(subDistrict);
        res.status(200).json({ subDistrict })

    }
)

exports.getCategory = catchError(
    async (req, res, next) => {
        const categories = await repo.categories.getAll()
        res.status(200).json({ categories })
    }
)

exports.createRestaurant = catchError(
    async (req, res, next) => {

        const { resData, openHours } = req.body

        resData.subDistrictCode = resData.subdistrictCode
        resData.lat = resData.lat + ""
        resData.lng = resData.lng + ""
        delete resData.subdistrictCode
        const newRestaurant = await repo.merchant.createRestaurant(resData)

        const newOpenHour = Object.fromEntries(Object.entries(openHours).filter(async ([day, time]) => {
            if (time.closed === false) {
                const data = {
                    restaurantId: newRestaurant.id,
                    date: day,
                    openTime: new Date(`2024-02-02T` + time.open),
                    closeTime: new Date(`2024-02-02T` + time.close)
                }
                await repo.merchant.createOpenHours(data)
            }
        }

        ))

        res.status(200).json({ newRestaurant })
    }
)

exports.getGeoDataByName = catchError(
    async (req, res, next) => {
        // const { postalCode } = req.body
        // console.log(postalCode);
        // const geoData = await repo.merchant.getGeoDataByPostCode(postalCode)
        // // const province
        // const [{ ...areaData }] = geoData
        // console.log(areaData, 'areaData');
        const { province, district, subdistrict } = req.body
        console.log(province, district);
        const provinceData = await repo.merchant.getProvinceByName(province)
        const districtData = await repo.merchant.getDistrictByName(district)
        const subDistrictData = await repo.merchant.getSubDistrictByName(subdistrict)



        res.status(200).json({ provinceData, districtData, subDistrictData })
    }
)
