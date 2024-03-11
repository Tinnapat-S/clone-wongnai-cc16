const Joi = require("joi")
const { validate } = require("./validate")
const { join } = require("path")

const validateSchemaCreateReview = Joi.object({
    restaurantId: Joi.string().required().trim().messages({
        "string.empty": "restaurantId is require",
        "any.required": "restaurantId is require",
    }),
    star: Joi.string().required().messages({
        "string.empty": "star is require",
        "any.required": "star is require",
    }),
    title: Joi.string().required().messages({
        "string.empty": "title is require",
        "any.required": "title is require",
    }),
    description: Joi.string().required().messages({
        "string.empty": "description is require",
        "any.required": "description is require",
    }),
})

exports.validateCreateReview = validate(validateSchemaCreateReview)
