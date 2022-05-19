import { Router } from "express";

import {
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * '/api/companies':
 *  get:
 *     tags:
 *     - Company
 *     summary: Get all companies
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/Company'
 *       404:
 *         description: No companies found
 *       500:
 *         description: Something went wrong
 */
router.get("/", getCompanies);

/**
 * @swagger
 * '/api/companies/{companyId}':
 *  get:
 *     tags:
 *     - Company
 *     summary: Get a single company by the companyId
 *     parameters:
 *      - name: companyId
 *        in: path
 *        description: The id of the company
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 *       500:
 *         description: Something went wrong
 */
router.get("/:id", getCompany);

/**
 * @swagger
 * '/api/companies/{companyId}':
 *  put:
 *     tags:
 *     - Company
 *     summary: Update a company
 *     parameters:
 *      - name: companyId
 *        in: path
 *        description: The id of the company
 *        required: true
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
 *      404:
 *        description: Company not found
 *      500:
 *        description: Something went wrong
 */
router.put("/:id", protect, updateCompany);

/**
 * @swagger
 * '/api/companies/{companyId}':
 *  delete:
 *     tags:
 *     - Company
 *     summary: Delete a company
 *     parameters:
 *      - name: companyId
 *        in: path
 *        description: The id of the company
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Company'
 *      404:
 *        description: Company not found
 *      500:
 *        description: Something went wrong
 */
router.delete("/:id", protect, deleteCompany);

export default router;
