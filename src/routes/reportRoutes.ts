import express from "express";
import {
    getAllBorrowsData,
} from "../controllers/reports";
import { defaultLimiter, requireUser } from "../middleware";

const router = express.Router();

router.get("/", defaultLimiter, requireUser, getAllBorrowsData);

export default router;

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Export all borrow records as CSV
 *     description: Returns borrow data as a CSV file with optional filters.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [borrowed, returned, overdue]
 *         description: Filter by borrow status
 *       - in: query
 *         name: returnDateBefore
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Return records with returnDate before this date
 *       - in: query
 *         name: returnDateAfter
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Return records with returnDate after this date
 *       - in: query
 *         name: bookId
 *         schema:
 *           type: integer
 *         description: Filter by book ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: CSV file containing borrow data
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
