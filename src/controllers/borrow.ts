import { Response } from "express";
import { customRequest } from "../types/customDefinition";
import {
    getBorrow,
    getAllBorrows,
    createBorrow,
    updateBorrow,
    returnBook,
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

    const borrows = await getAllBorrows(req.user.role !== '1', req.user.id, filters);

    return res.status(200).json({ data: borrows, error: false });
};

export const createBorrowData = async (req: customRequest, res: Response) => {
    const borrow = await createBorrow(req.body, req.user.id);
    return res.status(201).json({ data: borrow, error: false });
};

export const updateBorrowData = async (req: customRequest, res: Response) => {
    const transactionId = parseInt(req.params.transactionId);
    const borrow = await updateBorrow(transactionId, req.body);
    return res.status(200).json({ data: borrow, error: false });
};

export const returnBookData = async (req: customRequest, res: Response) => {
    const transactionId = parseInt(req.params.transactionId);
    await returnBook(transactionId, req.user.id);
    return res.status(200).json({ message: "Book returned successfully", error: false, });
};
