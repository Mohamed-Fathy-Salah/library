import Joi from "joi";

export const createBorrowerSchema = Joi.object({
    name: Joi.string().min(1).max(30).required(),
    email: Joi.string().email().required(),
});

export const updateBorrowerSchema = Joi.object({
    name: Joi.string().min(1).max(30),
    email: Joi.string().email(),
}).min(1); // require at least one field to update
