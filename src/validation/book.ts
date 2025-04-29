import Joi from "joi";

export const createBookSchema = Joi.object({
    title: Joi.string().min(1).max(30).required(),
    author: Joi.string().min(1).max(30).required(),
    ISBN: Joi.string().pattern(/^(97(8|9))?\d{9}(\d|X)$/)
        .required()
        .messages({
            "string.pattern.base": "Invalid ISBN format",
            "string.empty": "ISBN is required",
        }),
    quantity: Joi.number().min(1).required(),
    shelfLocation: Joi.string().min(1).max(30).required(),
});

export const updateBookSchema = Joi.object({
    title: Joi.string().min(1).max(30),
    author: Joi.string().min(1).max(30),
    ISBN: Joi.string()
        .pattern(/^(97(8|9))?\d{9}(\d|X)$/)
        .messages({
            "string.pattern.base": "Invalid ISBN format",
        }),
    quantity: Joi.number().min(1),
    shelfLocation: Joi.string().min(1).max(30),
}).min(1); // require at least one field to update
