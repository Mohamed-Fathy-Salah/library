import { Router } from "express";
import { requireUser, validateRequest } from "../middleware";
import {
    getBookData,
    getBookDataByISBN,
    getBooks,
    createBookData,
    updateBookData,
    deleteBookData,
} from "../controllers/book";
import { createBookSchema, updateBookSchema } from "../validation/book";

const router = Router();

router.use(requireUser);

router.get("/", getBooks);
router.get("/:id", getBookData);
router.get("/isbn/:isbn", getBookDataByISBN);
router.post("/", validateRequest(createBookSchema), createBookData);
router.patch("/:id", validateRequest(updateBookSchema), updateBookData);
router.delete("/:id", deleteBookData);

export default router;

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of books

 *   post:
 *     summary: Create a new book
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, author, ISBN, quantity, shelfLocation]
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               ISBN:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               shelfLocation:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book data

 *   patch:
 *     summary: Update book by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               ISBN:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               shelfLocation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated

 *   delete:
 *     summary: Delete book by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Book deleted
 */

/**
 * @swagger
 * /books/isbn/{isbn}:
 *   get:
 *     summary: Get book by ISBN
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book data
 *       404:
 *         description: Book not found
 */
