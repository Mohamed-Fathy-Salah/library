import { Router } from "express";
import { requireUser, validateRequest } from "../middleware";
import {
    getBorrowerData,
    getBorrowers,
    createBorrowerData,
    updateBorrowerData,
    deleteBorrowerData,
} from "../controllers/borrower";
import { createBorrowerSchema, updateBorrowerSchema } from "../validation/borrower";

const router = Router();

router.use(requireUser);

router.get("/", getBorrowers);
router.get("/:id", getBorrowerData);
router.post("/", validateRequest(createBorrowerSchema), createBorrowerData);
router.patch("/:id", validateRequest(updateBorrowerSchema), updateBorrowerData);
router.delete("/:id", deleteBorrowerData);

export default router;

/**
 * @swagger
 * /borrowers:
 *   get:
 *     summary: Get all borrowers
 *     security:
 *       - bearerAuth: []
 *     tags: [Borrower]
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
 *         description: List of borrowers

 *   post:
 *     summary: Create a new borrower
 *     security:
 *       - bearerAuth: []
 *     tags: [Borrower]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Borrower created
 */

/**
 * @swagger
 * /borrowers/{id}:
 *   get:
 *     summary: Get borrower by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Borrower]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Borrower data

 *   patch:
 *     summary: Update borrower by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Borrower]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Borrower updated

 *   delete:
 *     summary: Delete borrower by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Borrower]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Borrower deleted
 */
