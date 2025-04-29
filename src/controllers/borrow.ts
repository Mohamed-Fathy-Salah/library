import { NextFunction, Response } from "express";
import { customRequest } from "../types/customDefinition";
import { 
  getBorrow, 
  getAllBorrows, 
  createBorrow, 
  updateBorrow,
  returnBook,
  getOverdueBorrows,
  getBorrowsByUser,
  getBorrowsByBook
} from "../services/borrowService";
import { parseInt } from "lodash";

/**
 * Get borrow by transaction ID
 */
export const getBorrowData = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactionId = parseInt(req.params.transactionId, 0);
    const borrow = await getBorrow(transactionId);
    
    if (!borrow) {
      return res.status(404).json({
        message: "Borrow record not found",
        error: true,
      });
    }
    
    return res.status(200).json({
      data: borrow,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all borrows with optional filters
 */
export const getAllBorrowsData = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = {
      status: req.query.status as "borrowed" | "returned" | "overdue" | undefined,
      returnDateBefore: req.query.returnDateBefore ? new Date(req.query.returnDateBefore as string) : undefined,
      returnDateAfter: req.query.returnDateAfter ? new Date(req.query.returnDateAfter as string) : undefined,
      bookId: req.query.bookId ? parseInt(req.query.bookId as string, 0) : undefined,
      userId: req.query.userId ? parseInt(req.query.userId as string, 0) : undefined,
    };
    
    const borrows = await getAllBorrows(filters);
    
    return res.status(200).json({
      data: borrows,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create new borrow record
 */
export const createBorrowData = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const borrow = await createBorrow(req.body);
    
    return res.status(201).json({
      data: borrow,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update existing borrow record
 */
export const updateBorrowData = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactionId = parseInt(req.params.transactionId, 0);
    const borrow = await updateBorrow(transactionId, req.body);
    
    if (!borrow) {
      return res.status(404).json({
        message: "Borrow record not found",
        error: true,
      });
    }
    
    return res.status(200).json({
      data: borrow,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Return a book
 */
export const returnBookData = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactionId = parseInt(req.params.transactionId, 0);
    const borrow = await returnBook(transactionId);
    
    if (!borrow) {
      return res.status(404).json({
        message: "Borrow record not found",
        error: true,
      });
    }
    
    return res.status(200).json({
      data: borrow,
      message: "Book returned successfully",
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all overdue borrows
 */
export const getOverdueBorrowsData = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const borrows = await getOverdueBorrows();
    
    return res.status(200).json({
      data: borrows,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get borrows by user ID
 */
export const getBorrowsByUserData = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.userId, 0);
    const borrows = await getBorrowsByUser(userId);
    
    return res.status(200).json({
      data: borrows,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get borrows by book ID
 */
export const getBorrowsByBookData = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = parseInt(req.params.bookId, 0);
    const borrows = await getBorrowsByBook(bookId);
    
    return res.status(200).json({
      data: borrows,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};