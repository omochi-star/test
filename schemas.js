const Joi = require("joi");

module.exports.bookreviewSchema = Joi.object({
    bookreview: Joi.object({
        title: Joi.string().required(),
        author: Joi.string(),
        category: Joi.string(),
        rating: Joi.number(),
        comment: Joi.string(),
    }).required()
})