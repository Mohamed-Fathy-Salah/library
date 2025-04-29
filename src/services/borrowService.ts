import { Op } from "sequelize";
import sequelize from '../db/connection'
import Borrow from "../models/Borrow";
import Transaction from "../models/Transaction";
import Book from "../models/Book";
import { NotFoundError } from "../util/ApiError";

interface BorrowFilters {
    status?: "borrowed" | "returned" | "overdue";
    returnDateBefore?: Date;
    returnDateAfter?: Date;
    bookId?: number;
    userId?: number;
}

export const createBorrow = async (payload: any, userId: any) => {
    await sequelize.transaction(async (t) => {
        const book = await Book.findOne({
            where: { id: payload.bookId, available: { [Op.gt]: 0 } },
            attributes: ["id", "available"],
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (!book)
            throw new Error("Book not available");

        book.available -= 1;
        await book.save({ transaction: t });

        const { id: transactionId } = await Transaction.create({
            bookId: payload.bookId,
            userId: userId
        }, { transaction: t });

        await Borrow.create({
            transactionId,
            returnDate: payload.returnDate,
        }, { transaction: t });
    });
};

export const getBorrow = async (transactionId: number) => {
    const borrow = await Borrow.findByPk(transactionId, {
        attributes: ['returnDate', "actualReturnDate"],
        include: [{
            model: Transaction,
            attributes: ['id', 'bookId', 'userId', 'created_at']
        }]
    });
    return { ...borrow.get(), ...borrow.Transaction?.get(), Transaction: undefined };
};

export const getAllBorrows = async (isAdmin: boolean, userId: number, filters?: BorrowFilters) => {
    const whereClause: any = {};
    const includeOptions: any = [{ model: Transaction, attributes: ['id', 'bookId', 'userId', 'created_at'] }];
    const attributes: (keyof Borrow)[] = ["returnDate", "actualReturnDate"];

    switch (filters?.status) {
        case 'overdue':
            whereClause.actualReturnDate = null;
            whereClause.returnDate = { [Op.lt]: new Date() };
            break;
        case 'borrowed':
            whereClause.actualReturnDate = null;
            break;
        case 'returned':
            whereClause.actualReturnDate = { [Op.not]: null };
            break;
    }

    if (filters?.returnDateBefore || filters?.returnDateAfter) {
        whereClause.returnDate = {};
        if (filters.returnDateAfter)
            whereClause.returnDate[Op.gte] = filters.returnDateAfter;
        if (filters.returnDateBefore)
            whereClause.returnDate[Op.lte] = filters.returnDateBefore;
    }

    if (filters?.bookId || filters?.userId) {
        const transactionWhere: any = {};
        if (filters.bookId)
            transactionWhere.bookId = filters.bookId;
        if (filters.userId)
            transactionWhere.userId = filters.userId;
        includeOptions[0].where = transactionWhere;
    }

    if (!isAdmin)
        includeOptions[0].where = userId;

    const borrows = await Borrow.findAll({
        attributes,
        where: whereClause,
        include: includeOptions,
        order: [[Transaction, "created_at", "DESC"]]
    });

    return borrows.map(b => ({ ...b.get(), ...b.Transaction?.get(), Transaction: undefined }));
};

export const updateBorrow = async (transactionId: number, payload: any) => {
    try {
        const borrow = await Borrow.findByPk(transactionId);
        if (!borrow)
            return null;
        await borrow.update(payload);
        return await getBorrow(transactionId);
    } catch (error) {
        throw new Error(`Failed to update borrow record: ${error.message}`);
    }
};

export const returnBook = async (transactionId: number, userId: number) => {
    await sequelize.transaction(async (t) => {
        const borrow = await Borrow.findOne({
            where: { transactionId, actualReturnDate: null },
            include: { model: Transaction, attributes: ['bookId'], where: { userId } },
            transaction: t,
            lock: t.LOCK.UPDATE,
        });

        if (!borrow?.Transaction) throw new NotFoundError();

        await Book.increment('available', {
            by: 1,
            where: { id: borrow.Transaction.bookId },
            transaction: t,
        });

        await borrow.update(
            { actualReturnDate: new Date() },
            { transaction: t }
        );
    });
};
