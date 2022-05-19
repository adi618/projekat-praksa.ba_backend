import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *        - title
 *        - description
 *        - startDate
 *        - duration
 *        - location
 *        - category
 *       properties:
 *         title:
 *           type: string
 *           example: "Post Title"
 *         description:
 *           type: string
 *           example: "Post Description"
 *         startDate:
 *           type: string
 *           example: "2022-01-01"
 *         duration:
 *           type: string
 *           example: "30 days"
 *         location:
 *           type: string
 *           example: "Ulica 12, Sarajevo 71000, BiH"
 *         category:
 *           type: string
 *           example: "IT"
 */
const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    companyName: {
      type: String,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
