import { encryptSync } from "../util/encrypt";
import bcrypt from "bcrypt";
import User from "../models/User";
import { Op } from "sequelize";
import { NotFoundError } from "../util/ApiError";

export const createUser = async (payload: any) => {
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);
    return await User.create(payload);
};

export const getUserById = async (id: number) => {
    const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
    });
    if (!user)
        throw new NotFoundError("User not found");
    return user;
};

export const userExists = async (email: string) => {
    const count = await User.count({ where: { email } });
    return count > 0;
};

export const validatePassword = async (user: User, password: string) => {
    return await User.validPassword(password, user.password);
};

export const findOneUser = async (options: any, execludePassword: boolean = true) => {
    const where = { [Op.or]: [] as any, };
    const exclude = [];

    if (options.email) where[Op.or].push({ email: options.email });
    if (options.id) where[Op.or].push({ id: options.id });
    if (execludePassword) exclude.push("password");

    const user = await User.findOne({
        where,
        attributes: { exclude },
    });
    return user;
};

export const updateUserById = async (user: any, userId: number) => {
    if (user.password)
        user.password = encryptSync(user.password);

    return await User.update(user, { where: { id: userId } });
};

export const deleteUserById = async (userId: number) => {
    return await User.destroy({ where: { id: userId }, });
};
