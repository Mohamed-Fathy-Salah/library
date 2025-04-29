import { Router } from "express";
import { validateRequest } from "../middleware";
import {
    loginUser,
    registerUser,
} from "../controllers/auth";
import { loginSchema, registerSchema } from "../validation/user";
const authRouter = Router();

authRouter.post("/register", validateRequest(registerSchema), registerUser);
authRouter.post("/login", validateRequest(loginSchema), loginUser);

export default authRouter;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name:  name
 *               email: name@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *
 *
 *       "400":
 *         description:  Bad Request
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: name@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *
 *       "401":
 *         description: Invalid email or password
 *
 */
