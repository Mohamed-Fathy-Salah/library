import express from "express";
import {
  getBorrowData,
  getAllBorrowsData,
  createBorrowData,
  updateBorrowData,
  returnBookData,
  getOverdueBorrowsData,
  getBorrowsByUserData,
  getBorrowsByBookData,
} from "../controllers/borrow";

const router = express.Router();
router.get("/", getAllBorrowsData);
router.get("/:transactionId", getBorrowData);
router.post("/", createBorrowData);
router.put("/:transactionId", updateBorrowData);
router.post("/:transactionId/return", returnBookData);
router.get("/overdue/list", getOverdueBorrowsData);
router.get("/user/:userId", getBorrowsByUserData);
router.get("/book/:bookId", getBorrowsByBookData);
export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Borrow:
 *       type: object
 *       required:
 *         - transactionId
 *         - status
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
 *         status:
 *           type: string
 *           enum: [borrowed, returned, overdue]
 *           description: Current status of the borrowed book
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
 *         status: "borrowed"
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
 * /api/borrows:
 *   get:
 *     summary: Get all borrows
 *     tags: [Borrows]
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
 * /api/borrows/{transactionId}:
 *   get:
 *     summary: Get borrow by transaction ID
 *     tags: [Borrows]
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
 * /api/borrows:
 *   post:
 *     summary: Create a new borrow record
 *     tags: [Borrows]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *             properties:
 *               transactionId:
 *                 type: integer
 *               returnDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [borrowed, returned, overdue]
 *                 default: borrowed
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
 * /api/borrows/{transactionId}:
 *   put:
 *     summary: Update a borrow record
 *     tags: [Borrows]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               returnDate:
 *                 type: string
 *                 format: date-time
 *               actualReturnDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [borrowed, returned, overdue]
 *     responses:
 *       200:
 *         description: Borrow record updated successfully
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
 * /api/borrows/{transactionId}/return:
 *   post:
 *     summary: Mark a book as returned
 *     tags: [Borrows]
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
 * /api/borrows/overdue:
 *   get:
 *     summary: Get all overdue borrows
 *     tags: [Borrows]
 *     responses:
 *       200:
 *         description: List of overdue borrows
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
 * /api/borrows/user/{userId}:
 *   get:
 *     summary: Get borrows by user ID
 *     tags: [Borrows]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of borrows for the specified user
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
 * /api/borrows/book/{bookId}:
 *   get:
 *     summary: Get borrows by book ID
 *     tags: [Borrows]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Book ID
 *     responses:
 *       200:
 *         description: List of borrows for the specified book
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
