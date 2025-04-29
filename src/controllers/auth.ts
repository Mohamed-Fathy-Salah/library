import {
    createUser,
    findOneUser,
    userExists,
    validatePassword,
} from "../services/userService";
import { Request, Response } from "express";
import { omit } from "lodash";
import { sign } from "../util/jwt";
import { BadRequestError } from "../util/ApiError";
const omitData = ["password"];

export const registerUser = async (
    req: Request,
    res: Response
) => {
    let user = req.body;
    const userExist = await userExists(user.email);
    if (userExist)
        throw new BadRequestError("Email is alredy used");
    user = await createUser(user);
    const userData = omit(user?.toJSON(), omitData);
    const accessToken = sign({ ...userData });

    return res.status(200).json({
        data: userData,
        error: false,
        accessToken,
        msg: "User registered successfully",
    });
};

export const loginUser = async (
    req: Request,
    res: Response,
) => {
    const { email, password } = req.body;

    const user = await findOneUser({ email }, false);
    if (!user)
        throw new BadRequestError("Email is incorrect");

    const validPassword = await validatePassword(user, password);
    if (!validPassword)
        throw new BadRequestError("Password is incorrect");
    const userData = omit(user?.toJSON(), omitData);
    const accessToken = sign({ ...userData });

    return res.status(200).json({
        data: userData,
        accessToken,
        error: false,
    });
};
