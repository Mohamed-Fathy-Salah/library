import express from "express";
import {
    getBorrowData,
    getAllBorrowsData,
    createBorrowData,
    updateBorrowData,
    returnBookData,
} from "../controllers/borrow";
import { requireUser } from "../middleware";

const router = express.Router();

router.use(requireUser);

router.get("/", getAllBorrowsData);
router.get("/:transactionId", getBorrowData);
//todo: validate request
router.post("/", createBorrowData);
router.put("/:transactionId", updateBorrowData);
router.post("/:transactionId/return", returnBookData);

export default router;

//todo: update new request,response 
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
 * /borrows/{transactionId}:
 *   put:
 *     summary: Update a borrow record
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
