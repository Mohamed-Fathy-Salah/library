import { NextFunction, Request, Response } from "express";

export interface customRequest extends Request {
    user: any;
}

export interface customError extends Error {
    statusCode: number;
    errors?: { message: string }[];
}

export type ControllerFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;
