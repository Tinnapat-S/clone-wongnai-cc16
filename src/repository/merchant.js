const prisma = require("../models/prisma")
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

exports.createUser = data => prisma.merchant.create({ data });
exports.findUserById = id => prisma.merchant.findUnique({ where: { id } });
// module.exports.get = async (username) =>
//     await prisma.merchant.findFirst({
//         where: {
//             OR: [{ username: username }, { mobile: username }],
//         },
//     })

exports.getProvince = () =>
    prisma.province
        .findMany
        // { where: { id: 1 } }
        ()

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

exports.createMenu = (data) => prisma.menu.create({ data })
exports.deleteMenu = (id) => prisma.menu.delete({ where: { id } })
exports.updateMenu = (id, data) => prisma.menu.update({ where: { id }, data })
exports.updateMenuImg = (id, img) => prisma.menu.update({ where: { id }, data: { img } })
