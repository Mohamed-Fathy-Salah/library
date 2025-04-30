import express from "express";
import {
    getBorrowData,
    getAllBorrowsData,
    createBorrowData,
    returnBookData,
    deleteBorrowById,
} from "../controllers/borrow";
import { defaultLimiter, requireUser, validateRequest } from "../middleware";
import { createBorrowSchema } from "../validation/borrow";

const router = express.Router();

router.get("/", requireUser, getAllBorrowsData);
router.get("/:transactionId", requireUser, getBorrowData);
router.post("/", defaultLimiter, requireUser, validateRequest(createBorrowSchema), createBorrowData);
router.post("/:transactionId/return", requireUser, returnBookData);
router.delete("/:transactionId", requireUser, deleteBorrowById);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Borrow:
 *       type: object
 *       required:
 *         - transactionId
 *       properties:
 *         transactionId:
 *           type: integer
 *           description: The ID of the associated transaction (primary key)
 *         returnDate:
 *           type: string
 *           format: date-time
 *           description: Expected date the book is to be returned
 *         actualReturnDate:
 *           type: string
 *           format: date-time
 *           description: Actual date when the book was returned
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the borrow record was created
 *         last_updated:
 *           type: string
 *           format: date-time
 *           description: The date the borrow record was last updated
 *       example:
 *         transactionId: 1
 *         returnDate: "2025-05-15T00:00:00.000Z"
 *         actualReturnDate: null
 *         created_at: "2025-04-23T18:25:43.511Z"
 *         last_updated: "2025-04-23T18:25:43.511Z"
 */

/**
 * @swagger
 * tags:
 *   name: Borrows
 *   description: API for managing book borrows
 */

/**
 * @swagger
 * /borrows:
 *   get:
 *     summary: Get all borrows
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [borrowed, returned, overdue]
 *         description: Filter by status
 *       - in: query
 *         name: returnDateBefore
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by return date before (YYYY-MM-DD)
 *       - in: query
 *         name: returnDateAfter
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by return date after (YYYY-MM-DD)
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: page number
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: page count
 *         default: 10
 *     responses:
 *       200:
 *         description: List of borrows
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Borrow'
 *                 error:
 *                   type: boolean
 *                   example: false
 */

/**
 * @swagger
 * /borrows/{transactionId}:
 *   get:
 *     summary: Get borrow by transaction ID
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Borrow details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Borrow'
 *                 error:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Borrow record not found
 */

/**
 * @swagger
 * /borrows:
 *   post:
 *     summary: Create a new borrow record
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *             properties:
 *               borrowerId:
 *                 type: integer
 *               bookId:
 *                 type: integer
 *               returnDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Borrow record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Borrow'
 *                 error:
 *                   type: boolean
 *                   example: false
 */

/**
 * @swagger
 * /borrows/{transactionId}/return:
 *   post:
 *     summary: Mark a book as returned
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Borrow'
 *                 message:
 *                   type: string
 *                   example: Book returned successfully
 *                 error:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Borrow record not found
 */

/**
 * @swagger
 * /borrows/{transactionId}:
 *   delete:
 *     summary: Delete a borrow record by transaction ID
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Borrow record deleted
 *       404:
 *         description: Borrow not found
 *       401:
 *         description: Unauthorized
 */
