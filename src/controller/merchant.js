const repo = require("../repository")
const utils = require("../utils")
const { CustomError } = require("../config/error")
const { Role } = require("@prisma/client")
const { catchError } = require("../utils/catch-error");
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


exports.getProvince = catchError(
    async (req, res, next) => {
        const province = await repo.merchant.getAllProvince()
        res.status(200).json({ province })
    }
)

exports.getDistrict = catchError(
    async (req, res, next) => {
        const { provinceCode } = req.body
        console.log(req.body);
        const district = await repo.merchant.getAllDistrict(provinceCode)
        console.log(district);
        res.status(200).json({ district })

    }
)

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
        req.body.subDistrictCode = req.body.subdistrictCode
        delete req.body.subdistrictCode

        const newMerchant = await repo.merchant.createRestaurant(req.body)
        res.status(200).json({ newMerchant })
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
