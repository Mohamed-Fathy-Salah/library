import { Response } from "express";
import { customRequest } from "../types/customDefinition";
import {
    getBorrow,
    getAllBorrowsPaginated,
    createBorrow,
    returnBook,
    deleteBorrow,
} from "../services/borrowService";

export const getBorrowData = async (req: customRequest, res: Response) => {
    const transactionId = parseInt(req.params.transactionId);
    const borrow = await getBorrow(transactionId);
    return res.status(200).json({ data: borrow, error: false });
};

export const getAllBorrowsData = async (req: customRequest, res: Response) => {
    const filters = {
        status: req.query.status as "borrowed" | "returned" | "overdue" | undefined,
        returnDateBefore: req.query.returnDateBefore ? new Date(req.query.returnDateBefore as string) : undefined,
        returnDateAfter: req.query.returnDateAfter ? new Date(req.query.returnDateAfter as string) : undefined,
        bookId: req.query.bookId ? parseInt(req.query.bookId as string) : undefined,
        userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
    };

    const borrows = await getAllBorrowsPaginated(filters);

    return res.status(200).json({ data: borrows, error: false });
};

export const createBorrowData = async (req: customRequest, res: Response) => {
    const borrow = await createBorrow(req.body);
    return res.status(201).json({ data: borrow, error: false });
};

export const returnBookData = async (req: customRequest, res: Response) => {
    const transactionId = parseInt(req.params.transactionId);
    await returnBook(transactionId);
    return res.status(200).json({ message: "Book returned successfully", error: false, });
};

export const deleteBorrowById = async (req: customRequest, res: Response) => {
    const transactionId = parseInt(req.params.transactionId);
    await deleteBorrow(transactionId);
    return res.status(200).json({ message: "Deleted successfully", error: false, });
};
