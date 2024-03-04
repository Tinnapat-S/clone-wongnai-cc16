const repo = require("../repository");
const { catchError } = require("../utils/catch-error");

exports.getProvince = catchError(
    async (req, res, next) => {
        const province = await repo.merchant.getProvince()
        res.status(200).json({ province })
    }
)

exports.getDistrict = catchError(
    async (req, res, next) => {
        const { provinceCode } = req.body
        console.log(req.body);
        const district = await repo.merchant.getDistrict(provinceCode)
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


// exports.getCodeByName = catchError(
//     async (req, res, next) => { 
//         const 
//     }
// )