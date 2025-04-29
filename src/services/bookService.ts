import { Op } from "sequelize";
import Book from "../models/Book";
import { NotFoundError } from "../util/ApiError";

export const createBook = async (payload: any) => {
    payload.available = payload.quantity;
    return await Book.create(payload);
};

export const getBookById = async (id: number) => {
    const book = await Book.findByPk(id);
    if (!book)
        throw new NotFoundError();
    return book;
};

export const getBookByISBN = async (ISBN: string) => {
    return await Book.findOne({ where: { ISBN } });
};

export const getAllBooks = async ({ title, author }: { title?: string, author?: string }) => {
    const where: any = {};
    if (title) where.title = { [Op.iLike]: `${title}%` };
    if (author) where.author = { [Op.iLike]: `${author}%` };

    return await Book.findAll({ where: where });
};

export const updateBook = async (bookId: number, book: any) => {
    const [affectedCount] = await Book.update(book, { where: { id: bookId }, });
    if (affectedCount == 0) throw new NotFoundError();
};

export const deleteBook = async (id: number) => {
    const affectedCount = await Book.destroy({ where: { id }, });
    if (affectedCount == 0) throw new NotFoundError();
};
