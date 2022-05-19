import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { upload } from "../middleware/images.js";

const router = Router();

/**
 * @swagger
 * '/api/login':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Login as existing company
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              type: object
 *              required:
 *                 - email
 *                 - password
 *              properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "email@email.com"
 *                 password:
 *                   type: string
 *                   format: password
 *                   example: "Password123%"
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Company'
 *      400:
 *        description: Wrong credentials
 *      500:
 *        description: Something went wrong
 */
router.post("/login", login);

/**
 * @swagger
 * '/api/register':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Register a new company
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/Company'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Company'
 *      400:
 *        description: Wrong credentials
 *      500:
 *        description: Something went wrong
 */
router.post("/register", upload.single("profilePicture"), register);

export default router;
