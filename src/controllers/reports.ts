import { customRequest } from "customDefinition";
import { Parser } from "json2csv";
import { Response } from "express";
import { getAllBorrows } from "../services/borrowService";

export const getAllBorrowsData = async (req: customRequest, res: Response) => {
    const filters = {
        status: req.query.status as "borrowed" | "returned" | "overdue" | undefined,
        returnDateBefore: req.query.returnDateBefore ? new Date(req.query.returnDateBefore as string) : undefined,
        returnDateAfter: req.query.returnDateAfter ? new Date(req.query.returnDateAfter as string) : undefined,
        bookId: req.query.bookId ? parseInt(req.query.bookId as string) : undefined,
        userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
    };

    const borrows = await getAllBorrows(req.user.role !== '1', req.user.id, filters);
    const parser = new Parser();
    const csv = parser.parse(borrows);

    res.header("Content-Type", "text/csv");
    res.attachment("borrows.csv");
    res.send(csv);
};
