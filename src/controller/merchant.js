const repo = require("../repository")
const utils = require("../utils")
const { CustomError } = require("../config/error")
const { Role } = require("@prisma/client")
const { catchError } = require("../utils/catch-error")
const { uploadCloudinary } = require("../services/upload-cloudinary")
const fs = require("fs/promises")
const { createError } = require("../utils/creat-error")

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

exports.getSubDistrict = catchError(
    async (req, res, next) => {
        const { districtCode } = req.body
        console.log(req.body);
        const subDistrict = await repo.merchant.getSubDistrict(districtCode)
        console.log(subDistrict);
        res.status(200).json({ subDistrict })

    }
)

module.exports.register = async (req, res, next) => {
  try {
      const { name,  username, mobile, password, confirmPassword } = req.body
      console.log(req.body)
      // console.log(req.files.imgProfile[0].path)
      
      const existsUser = await repo.merchant.findUserByUsernameOrMobile(
        req.body.username || req.body.mobile
      );
    
      if (existsUser) {
        throw new CustomError('USERNAME_OR_MOBILE_IN_USE', 400);
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
      // SIGN token from merchant data
      // console.log(merchant)
      console.log(merchant)
      const token = utils.jwt.sign({ merchantId: merchant.id })

      res.status(200).json({ token, merchant })
  } catch (err) { 
   
      console.log(err)
      next(err)
  }
  return
}

// exports.register = catchError(async (req, res, next) => {
//     const existsUser = await repo.merchant.findUserByUsernameOrMobile(
//       req.body.username || req.body.mobile
//     );
  
//     if (existsUser) {
//       createError('USERNAME_OR_MOBILE_IN_USE', 400);
//     }
  
//     req.body.password = await utils.bcrypt.hashed(req.body.password);
  
//     const newUser = await repo.merchant.createUser(req.body);
//     const payload = { userId: newUser.id };
//     const accessToken = utils.jwt.sign(payload);
//     delete newUser.password;
  
//     res.status(201).json({ accessToken, newUser });
//   });

exports.login = catchError(async (req, res, next) => {
    const existsUser = await repo.merchant.findUserByUsernameOrMobile(
      req.body.usernameOrMobile
    );
  
    if (!existsUser) {
      createError('invalid credentials', 400);
    }
    // const isMatch = await repo.merchant.findPassWordTest(
    //     req.body.password
    // )
    const isMatch = await utils.bcrypt.compare(
      req.body.password,
      existsUser.password
    );
  
    if (!isMatch) {
      createError('invalid credentials', 400);
    }
  
    const payload = { userId: existsUser.id };
    const accessToken = utils.jwt.sign(payload);
    delete existsUser.password;
  
    res.status(200).json({ accessToken, merchant: existsUser });
  });


// module.exports.login = async (req, res, next) => {
//     try {
//         const { username, password } = req.body
//         // GET username from database
//         // console.log(req.body, "******")
//         const user = await repo.merchant.get(username)
//         // console.log(user.name, "user")
//         if (!user) throw new CustomError("Username is wrong", "WRONG_INPUT", 400)

//         // COMPARE password with database
//         // const result = await utils.bcrypt.compare(password, user.password)
//         const result = await repo.merchant.get(password, merchant.password)
//         if (!result) throw new CustomError("Password is wrong", "WRONG_INPUT", 400)

//         // DELETE KEY of password from user data
//         // delete user.password
//         // delete user.createdAt
       
//         // SIGN token from user data
//         const token = utils.jwt.sign({ userId: user.id })
//         res.status(200).json({ token, user: user })
//     } catch (err) {
//         next(err)
//     }
//     return
// }
// exports.getCodeByName = catchError(
//     async (req, res, next) => {
//         const
//     }
// )
