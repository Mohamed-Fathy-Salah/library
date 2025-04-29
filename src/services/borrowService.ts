import { Op } from "sequelize";
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

/**
 * Create a new borrow record
 * @param payload Borrow data including transactionId
 * @returns The created borrow record
 */
export const createBorrow = async (payload: any) => {
  try {
    const borrow = await Borrow.create(payload);
    return borrow;
  } catch (error) {
    throw new Error(`Failed to create borrow record: ${error.message}`);
  }
};

/**
 * Get a borrow record by transaction ID
 * @param transactionId Transaction ID
 * @returns The found borrow record or null
 */
export const getBorrow = async (transactionId: number) => {
  try {
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
  } catch (error) {
    throw new Error(`Failed to get borrow record: ${error.message}`);
  }
};

/**
 * Get all borrow records with optional filters
 * @param filters Optional filters for borrow records
 * @returns Array of borrow records
 */
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

    // Apply status filter
    if (filters?.status) {
      whereClause.status = filters.status;
    }

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
      order: [["created_at", "DESC"]]
    });
    
    return borrows;
  } catch (error) {
    throw new Error(`Failed to get borrow records: ${error.message}`);
  }
};

/**
 * Update a borrow record
 * @param transactionId Transaction ID
 * @param payload Update data
 * @returns The updated borrow record
 */
export const updateBorrow = async (transactionId: number, payload: any) => {
  try {
    const borrow = await Borrow.findByPk(transactionId);
    
    if (!borrow) {
      return null;
    }

    await borrow.update(payload);
    
    // Reload the instance with associations
    return await getBorrow(transactionId);
  } catch (error) {
    throw new Error(`Failed to update borrow record: ${error.message}`);
  }
};

/**
 * Mark a book as returned
 * @param transactionId Transaction ID
 * @returns The updated borrow record
 */
export const returnBook = async (transactionId: number) => {
  try {
    const borrow = await Borrow.findByPk(transactionId);
    
    if (!borrow) {
      return null;
    }

    await borrow.update({
      actualReturnDate: new Date(),
      status: "returned"
    });
    
    return await getBorrow(transactionId);
  } catch (error) {
    throw new Error(`Failed to return book: ${error.message}`);
  }
};

/**
 * Get all overdue borrows
 * @returns Array of overdue borrow records
 */
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

/**
 * Get borrows by user ID
 * @param userId User ID
 * @returns Array of borrow records
 */
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

/**
 * Get borrows by book ID
 * @param bookId Book ID
 * @returns Array of borrow records
 */
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