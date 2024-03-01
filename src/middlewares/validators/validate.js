const Joi = require("joi")

const validate = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req.body)
    if (error) {
        throw error
    }
    req.body = value
    next()
}
module.exports = { validate }
