import { Op } from "sequelize";
import { NotFoundError } from "../util/ApiError";
import Borrower from "../models/Borrower";

export const createBorrower = async (payload: any) => {
    return await Borrower.create(payload);
};

export const getBorrowerById = async (id: number) => {
    const borrower = await Borrower.findByPk(id);
    if (!borrower) throw new NotFoundError();
    return borrower;
};

export const getAllBorrowers = async ({
    name,
    email,
    page = 1,
    limit = 10,
}: {
    name?: string;
    email?: string;
    page?: number;
    limit?: number;
}) => {
    const where: any = {};
    if (name) where.name = { [Op.iLike]: `${name}%` };
    if (email) where.email = { [Op.iLike]: `${email}%` };

    return await Borrower.findAndCountAll({
        where: where,
        offset: (page - 1) * limit,
        limit,
    });
};

export const updateBorrower = async (borrowerId: number, borrower: any) => {
    const [affectedCount] = await Borrower.update(borrower, { where: { id: borrowerId } });
    if (affectedCount == 0) throw new NotFoundError();
};

export const deleteBorrower = async (id: number) => {
    const affectedCount = await Borrower.destroy({ where: { id } });
    if (affectedCount == 0) throw new NotFoundError();
};
