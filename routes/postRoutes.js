import { Router } from "express";

import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * '/api/posts':
 *  post:
 *     tags:
 *     - Post
 *     summary: Create a post
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/Post'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      500:
 *        description: Something went wrong
 */
router.post("/", protect, createPost);

/**
 * @swagger
 * '/api/posts':
 *  get:
 *     tags:
 *     - Post
 *     summary: Get all posts
 *     parameters:
 *      - name: search
 *        in: query
 *        schema:
 *          type: string
 *        description: query parameter to search posts by title, location or company name
 *        required: false
 *      - name: id
 *        in: query
 *        schema:
 *          type: string
 *        description: query parameter to filter posts by company id
 *        required: false
 *      - name: city
 *        in: query
 *        schema:
 *          type: string
 *        description: query parameter to filter posts by city
 *        required: false
 *      - name: cat
 *        in: query
 *        schema:
 *          type: string
 *        description: query parameter to filter posts by category
 *        required: false
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/Post'
 *       404:
 *         description: No posts found
 *       500:
 *         description: Something went wrong
 */
router.get("/", getPosts);

/**
 * @swagger
 * '/api/posts/{postId}':
 *  get:
 *     tags:
 *     - Post
 *     summary: Get a single post by the postId
 *     parameters:
 *      - name: postId
 *        in: path
 *        description: The id of the post
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Something went wrong
 */
router.get("/:id", getPost);

/**
 * @swagger
 * '/api/posts/{postId}':
 *  put:
 *     tags:
 *     - Post
 *     summary: Update a post
 *     parameters:
 *      - name: postId
 *        in: path
 *        description: The id of the post
 *        required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/Post'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      404:
 *        description: Post not found
 *      500:
 *        description: Something went wrong
 */
router.put("/:id", protect, updatePost);

/**
 * @swagger
 * '/api/posts/{postId}':
 *  delete:
 *     tags:
 *     - Post
 *     summary: Delete a post
 *     parameters:
 *      - name: postId
 *        in: path
 *        description: The id of the post
 *        required: true
 *     responses:
 *      204:
 *        description: The Post was deleted successfully.
 *      404:
 *        description: Post not found
 *      500:
 *        description: Something went wrong
 */
router.delete("/:id", protect, deletePost);

export default router;
