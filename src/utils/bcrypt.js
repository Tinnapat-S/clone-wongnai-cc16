const bcrypt = require("bcryptjs")

module.exports.hashed = async (password) => await bcrypt.hash(password, +process.env.BCRYPT_SALT ?? 10)
module.exports.compare = async (input, hashed) => await bcrypt.compare(input, hashed)
