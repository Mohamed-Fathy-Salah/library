import Joi from "joi";

export const createBorrowSchema = Joi.object({
    bookId: Joi.number().min(1).required(),
    borrowerId: Joi.number().min(1).required(),
    returnDate: Joi.date().required(),
});
