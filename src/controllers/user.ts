import { findOneUser, updateUserById } from "../services/userService";
import { Response } from "express";
import { omit } from "lodash";
import { customRequest } from "../types/customDefinition";
import { NotFoundError } from "../util/ApiError";

const omitData = ["password"];

export const updateUser = async (
    req: customRequest,
    res: Response,
) => {
    const { id: userId } = req.user;

    let body = req.body;
    body = omit(body, omitData);

    const user = await findOneUser({ id: userId });

    if (!user)
        throw new NotFoundError();

    const updated = await updateUserById(body, userId);

    return res.status(200).json({
        data: updated[0],
        message: updated[0] ? "Data updated successfully" : "failed to update",
        error: false,
    });
};

export const getUserData = async (req: customRequest, res: Response,) => {
    return res.status(200).json({ data: req.user, error: false, });
};
