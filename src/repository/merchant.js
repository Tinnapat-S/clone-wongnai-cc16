const prisma = require('../models/prisma')
// const { catchError } = require('../utils/catch-error')

exports.findUserByUsernameOrMobile = usernameOrMobile =>
  prisma.merchant.findFirst({
    where: {
      OR: [{ username: usernameOrMobile }, { mobile: usernameOrMobile }]
    }
  });

  exports.findPassWordTest = async (password) => {
    const merchant = await prisma.merchant.findFirst({
      where: {
        OR: [
          {
            password: password
          }
        ]
      }
    });
  
    return merchant;
  };

exports.createUser = data => prisma.user.create({ data });

// module.exports.get = async (username) =>
//     await prisma.merchant.findFirst({
//         where: {
//             OR: [{ username: username }, { mobile: username }],
//         },
//     })

exports.getProvince = () => prisma.province.findMany(
    // { where: { id: 1 } }
)

exports.getDistrict = (provinceCode) => prisma.district.findMany({ where: { provinceCode } })

exports.getSubDistrict = (districtCode) => prisma.subDistrict.findMany({ where: { districtCode } })

// exports.getCodeByName = (provinceName) => prisma.district.findFirst({
//     where: {
//         OR: [
//             { provinceNameEn: provinceName },
//             { provinceNameTh: provinceName },
//         ]
//     }
// })

