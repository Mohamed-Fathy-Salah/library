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

router.get("/:id", getBookData);
router.get("/isbn/:isbn", getBookDataByISBN);
router.get("/", getBooks);
router.post("/", validateRequest(createBookSchema), createBookData);
router.patch("/:id", validateRequest(updateBookSchema), updateBookData);
router.delete("/:id", deleteBookData);

export default router;

/**
 * @swagger
 * tags:
 *   name: Book
 *   description: Operations related to books
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         description: Book not found
 */

/**
 * @swagger
 * /books/isbn/{isbn}:
 *   get:
 *     summary: Get book by ISBN
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: isbn
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         description: Book not found
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get books by author and/or title
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: author
 *         in: query
 *         schema:
 *           type: string
 *       - name: title
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         description: No books found
 *   post:
 *     summary: Create a new book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       "201":
 *         description: Created
 */

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     summary: Update a book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         description: Book not found
 *   delete:
 *     summary: Delete a book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *         description: Deleted
 *       "404":
 *         description: Book not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         ISBN:
 *           type: string
 *         shelfLocation:
 *           type: string
 *         quantity:
 *           type: integer
 *       required:
 *         - title
 *         - author
 *         - ISBN
 *         - shelfLocation
 *         - quantity
 */
