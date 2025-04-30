import { customError } from "customDefinition";
import { NextFunction, Request, Response } from "express";
import { ApiError, BadRequestError, ServerError } from "../util/ApiError";

export const errorHandler = (
    error: customError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
): void => {
    let err = error;

    if (Array.isArray(error.errors)) {
        const messages = "Please send valid request"
        err = new BadRequestError(messages);
    }
    else if (!(error instanceof ApiError)) {
        err = new ServerError(error.message);
    }
    const { statusCode, message } = err;

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
    };

    res.status(statusCode).send(response);
};
