import { Op } from "sequelize";
import Book from "../models/Book";
import sequelize from "../db/connection";
import { BadRequestError, NotFoundError } from "../util/ApiError";

export const createBook = async (payload: any) => {
  payload.available = payload.quantity;
  return await Book.create(payload);
};

export const getBookById = async (id: number) => {
  const book = await Book.findByPk(id);
  if (!book) throw new NotFoundError();
  return book;
};

export const getBookByISBN = async (ISBN: string) => {
  return await Book.findOne({ where: { ISBN } });
};

export const getAllBooks = async ({
  title,
  author,
  page = 1,
  limit = 10,
}: {
  title?: string;
  author?: string;
  page?: number;
  limit?: number;
}) => {
  const where: any = {};
  if (title) where.title = { [Op.iLike]: `${title}%` };
  if (author) where.author = { [Op.iLike]: `${author}%` };

  return await Book.findAndCountAll({
    where: where,
    offset: (page - 1) * limit,
    limit,
  });
};

export const updateBook = async (bookId: number, book: any) => {
  await sequelize.transaction(async t => {
    const existing = await Book.findByPk(bookId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!existing) throw new NotFoundError();

    if (book.quantity !== undefined) {
      if (existing.available > book.quantity) {
        throw new BadRequestError("New quantity cannot be less than current available copies.");
      }
      existing.available += book.quantity - existing.quantity;
    }

    await existing.update(book, { transaction: t });
  });
};

export const deleteBook = async (id: number) => {
  const affectedCount = await Book.destroy({ where: { id } });
  if (affectedCount == 0) throw new NotFoundError();
};
