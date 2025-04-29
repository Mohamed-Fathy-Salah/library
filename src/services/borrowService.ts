import { Op } from "sequelize";
import sequelize from '../db/connection'
import Borrow from "../models/Borrow";
import Transaction from "../models/Transaction";
import Book from "../models/Book";
import User from "../models/User";

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
        include: [
            {
                model: Transaction,
                include: [
                    { model: Book },
                    { model: User }
                ]
            }
        ]
    });
    return borrow;
};

export const getAllBorrows = async (filters?: BorrowFilters) => {
    try {
        const whereClause: any = {};
        const includeOptions: any = [
            {
                model: Transaction,
                include: [
                    { model: Book },
                    { model: User }
                ]
            }
        ];

        // todo:Apply status filter
        //if (filters?.status) {
        //whereClause.status = filters.status;
        //}

        // Apply return date range filters
        if (filters?.returnDateBefore || filters?.returnDateAfter) {
            whereClause.returnDate = {};

            if (filters.returnDateAfter) {
                whereClause.returnDate[Op.gte] = filters.returnDateAfter;
            }

            if (filters.returnDateBefore) {
                whereClause.returnDate[Op.lte] = filters.returnDateBefore;
            }
        }

        // Apply book and user filters through the transaction association
        if (filters?.bookId || filters?.userId) {
            const transactionWhere: any = {};

            if (filters.bookId) {
                transactionWhere.bookId = filters.bookId;
            }

            if (filters.userId) {
                transactionWhere.userId = filters.userId;
            }

            includeOptions[0].where = transactionWhere;
        }

        const borrows = await Borrow.findAll({
            where: whereClause,
            include: includeOptions,
            order: [[Transaction, "created_at", "DESC"]]
        });

        return borrows;
    } catch (error) {
        throw new Error(`Failed to get borrow records: ${error.message}`);
    }
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

        if (!borrow?.Transaction) throw new Error("not found");

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

export const getOverdueBorrows = async () => {
    try {
        const today = new Date();

        const borrows = await Borrow.findAll({
            where: {
                status: "borrowed",
                returnDate: {
                    [Op.lt]: today
                }
            },
            include: [
                {
                    model: Transaction,
                    include: [
                        { model: Book },
                        { model: User }
                    ]
                }
            ],
            order: [["returnDate", "ASC"]]
        });

        return borrows;
    } catch (error) {
        throw new Error(`Failed to get overdue borrow records: ${error.message}`);
    }
};

export const getBorrowsByUser = async (userId: number) => {
    try {
        const borrows = await Borrow.findAll({
            include: [
                {
                    model: Transaction,
                    where: { userId },
                    include: [
                        { model: Book },
                        { model: User }
                    ]
                }
            ],
            order: [["created_at", "DESC"]]
        });

        return borrows;
    } catch (error) {
        throw new Error(`Failed to get borrows by user: ${error.message}`);
    }
};

export const getBorrowsByBook = async (bookId: number) => {
    try {
        const borrows = await Borrow.findAll({
            include: [
                {
                    model: Transaction,
                    where: { bookId },
                    include: [
                        { model: Book },
                        { model: User }
                    ]
                }
            ],
            order: [["created_at", "DESC"]]
        });

        return borrows;
    } catch (error) {
        throw new Error(`Failed to get borrows by book: ${error.message}`);
    }
};
