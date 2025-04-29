import { NextFunction, Response } from "express";
import { customRequest } from "../types/customDefinition";
import { getBookById, getBookByISBN, getAllBooks, createBook, updateBook, deleteBook } from "../services/bookService";
import { parseInt } from "lodash";

export const getBookData = async (
    req: customRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = parseInt(req.params.id, 0);
        const book = await getBookById(id);
        return res.status(200).json({
            data: book,
            error: false,
        });
    } catch (err) {
        next(err);
    }
};

export const getBookDataByISBN = async (req: customRequest, res: Response, next: NextFunction) => {
    try {
        const { isbn } = req.params;
        const book = await getBookByISBN(isbn);
        return res.status(200).json({ data: book, error: false });
    } catch (err) {
        next(err);
    }
};

export const getBooks = async (req: customRequest, res: Response, next: NextFunction) => {
    try {
        const books = await getAllBooks(req.query);
        return res.status(200).json({ data: books, error: false });
    } catch (err) {
        next(err);
    }
};

export const createBookData = async (req: customRequest, res: Response, next: NextFunction) => {
  try {
    const book = await createBook(req.body);
    return res.status(201).json({ data: book, error: false });
  } catch (err) {
    next(err);
  }
};

export const updateBookData = async (req: customRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const updatedBook = await updateBook(id, req.body);
    return res.status(200).json({ data: updatedBook, error: false });
  } catch (err) {
    next(err);
  }
};

export const deleteBookData = async (req: customRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    await deleteBook(id);
    return res.status(200).json({ message: "Book deleted successfully", error: false });
  } catch (err) {
    next(err);
  }
};
