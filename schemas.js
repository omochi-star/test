const Joi = require("joi");

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        content: Joi.string().required(),
        rating: Joi.number()
        // owner: Joi.string(),
        // category: Joi.string(),
    }).required()
})