import { Response } from "express";
import { customRequest } from "../types/customDefinition";
import { getBookById, getBookByISBN, getAllBooks, createBook, updateBook, deleteBook } from "../services/bookService";

export const getBookData = async (
    req: customRequest,
    res: Response,
) => {
    const id = parseInt(req.params.id, 10);
    const book = await getBookById(id);
    return res.status(200).json({ data: book, error: false });
};

export const getBookDataByISBN = async (req: customRequest, res: Response) => {
    const { isbn } = req.params;
    const book = await getBookByISBN(isbn);
    return res.status(200).json({ data: book, error: false });
};

export const getBooks = async (req: customRequest, res: Response) => {
    const books = await getAllBooks(req.query);
    return res.status(200).json({ data: books, error: false });
};

export const createBookData = async (req: customRequest, res: Response) => {
    const book = await createBook(req.body);
    return res.status(201).json({ data: book, message: "Book created successfully", error: false });
};

export const updateBookData = async (req: customRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    await updateBook(id, req.body);
    return res.status(200).json({ message: "Book updated successfully", error: false });
};

export const deleteBookData = async (req: customRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    await deleteBook(id);
    return res.status(200).json({ message: "Book deleted successfully", error: false });
};
