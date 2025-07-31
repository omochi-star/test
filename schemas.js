const Joi = require("joi");

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        content: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});

module.exports.bookSchema = Joi.object({
    books: Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required(),
        isbn: Joi.string(),
        category: Joi.string(),
        coverImageUrl: Joi.string(),
        description: Joi.string(),
    }).required()
});