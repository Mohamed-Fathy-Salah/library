import { Op } from "sequelize";
import sequelize from "../db/connection";
import Borrow from "../models/Borrow";
import Transaction from "../models/Transaction";
import Book from "../models/Book";
import { NotFoundError } from "../util/ApiError";
import Borrower from "../models/Borrower";

interface BorrowFilters {
  status?: "borrowed" | "returned" | "overdue";
  returnDateBefore?: Date;
  returnDateAfter?: Date;
  bookId?: number;
  borrowerId?: number;
  page?: number;
  limit?: number;
}

export const createBorrow = async (payload: any) => {
  await sequelize.transaction(async t => {
    const book = await Book.findOne({
      where: { id: payload.bookId, available: { [Op.gt]: 0 } },
      attributes: ["id", "available"],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!book) throw new Error("Book not available");

    book.available -= 1;
    await book.save({ transaction: t });

    const { id: transactionId } = await Transaction.create(
      {
        bookId: payload.bookId,
        borrowerId: payload.borrowerId,
      },
      { transaction: t }
    );

    await Borrow.create(
      {
        transactionId,
        returnDate: payload.returnDate,
      },
      { transaction: t }
    );
  });
};

export const getBorrow = async (transactionId: number) => {
  const borrow = await Borrow.findByPk(transactionId, {
    attributes: ["returnDate", "actualReturnDate"],
    include: [
      {
        model: Transaction,
        attributes: ["id", "bookId", "borrowerId", "created_at"],
      },
    ],
  });
  if(!borrow)
      throw new NotFoundError();
  return {
    ...borrow.get(),
    ...borrow.Transaction?.get(),
    Transaction: undefined,
  };
};

export const getAllBorrows = async (filters?: BorrowFilters) => {
  const whereClause: any = {};
  const includeOptions: any = [
    {
      model: Transaction,
      attributes: ["created_at"],
      include: [
        {
          model: Book,
          attributes: ["title"],
        },
        {
          model: Borrower,
          attributes: ["email"],
        },
      ],
    },
  ];
  const attributes: (keyof Borrow)[] = ["returnDate", "actualReturnDate"];

  switch (filters?.status) {
    case "overdue":
      whereClause.actualReturnDate = null;
      whereClause.returnDate = { [Op.lt]: new Date() };
      break;
    case "borrowed":
      whereClause.actualReturnDate = null;
      break;
    case "returned":
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

  if (filters?.bookId || filters?.borrowerId) {
    const transactionWhere: any = {};
    if (filters.bookId) transactionWhere.bookId = filters.bookId;
    if (filters.borrowerId) transactionWhere.borrowerId = filters.borrowerId;
    includeOptions[0].where = transactionWhere;
  }

  const page = filters.page || 1;
  const limit = filters.limit || 10;

  const { count, rows } = await Borrow.findAndCountAll({
    attributes,
    where: whereClause,
    include: includeOptions,
    limit,
    offset: (page - 1) * limit,
    order: [[Transaction, "created_at", "DESC"]],
  });

  return {
    count,
    rows: rows.map(b => ({
      ...b.get(),
      ...b.Transaction?.get(),
      Transaction: undefined,
    })),
  };
};

export const getAllBorrowsPaginated = async (
  filters?: BorrowFilters
) => {
  const whereClause: any = {};
  const includeOptions: any = [
    {
      model: Transaction,
      attributes: ["id", "bookId", "borrowerId", "created_at"],
    },
  ];
  const attributes: (keyof Borrow)[] = ["returnDate", "actualReturnDate"];

  switch (filters?.status) {
    case "overdue":
      whereClause.actualReturnDate = null;
      whereClause.returnDate = { [Op.lt]: new Date() };
      break;
    case "borrowed":
      whereClause.actualReturnDate = null;
      break;
    case "returned":
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

  if (filters?.bookId || filters?.borrowerId) {
    const transactionWhere: any = {};
    if (filters.bookId) transactionWhere.bookId = filters.bookId;
    if (filters.borrowerId) transactionWhere.borrowerId = filters.borrowerId;
    includeOptions[0].where = transactionWhere;
  }

  const page = filters.page || 1;
  const limit = filters.limit || 10;

  const { count, rows } = await Borrow.findAndCountAll({
    attributes,
    where: whereClause,
    include: includeOptions,
    limit,
    offset: (page - 1) * limit,
    order: [[Transaction, "created_at", "DESC"]],
  });

  return {
    count,
    rows: rows.map(b => ({
      ...b.get(),
      ...b.Transaction?.get(),
      Transaction: undefined,
    })),
  };
};

export const returnBook = async (transactionId: number) => {
  await sequelize.transaction(async t => {
    const borrow = await Borrow.findOne({
      where: { transactionId, actualReturnDate: null },
      include: {
        model: Transaction,
        attributes: ["bookId"],
      },
      transaction: t,
      lock: { level: t.LOCK.UPDATE, of: Borrow },
    });

    if (!borrow?.Transaction) throw new NotFoundError();

    await Book.increment("available", {
      by: 1,
      where: { id: borrow.Transaction.bookId },
      transaction: t,
    });

    await borrow.update({ actualReturnDate: new Date() }, { transaction: t });
  });
};

export const deleteBorrow = async (transactionId: number) => {
  await sequelize.transaction(async t => {
    const borrow = await Borrow.findOne({
      where: { transactionId, actualReturnDate: null },
      include: {
        model: Transaction,
        attributes: ["bookId"],
      },
      transaction: t,
      lock: { level: t.LOCK.UPDATE, of: Borrow },
    });

    if (!borrow?.Transaction) throw new NotFoundError();

    await Book.increment("available", {
      by: 1,
      where: { id: borrow.Transaction.bookId },
      transaction: t,
    });

    await borrow.destroy({transaction: t});
  });
};
