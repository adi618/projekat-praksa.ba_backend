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
 *        - endDate
 *        - applicationDue
 *        - location
 *        - category
 *        - workTimeType
 *       properties:
 *         title:
 *           type: string
 *           example: "Post Title"
 *         description:
 *           type: string
 *           example: "Post Description"
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2022-01-01"
 *         endDate:
 *           type: string
 *           format: date
 *           example: "2022-01-01"
 *         applicationDue:
 *           format: date
 *           type: string
 *           example: "2022-01-01"
 *         location:
 *           type: array
 *           items:
 *            type: string
 *           example: ["Remote", "Sarajevo", "Zenica"]
 *         workTimeType:
 *           type: array
 *           items:
 *            type: string
 *           example: ["Full time", "Part-time"]
 *         category:
 *           type: string
 *           example: "IT"
 *         company:
 *           readOnly: true
 *           All of:
 *            - $ref: '#/components/schemas/Company'
 *         companyName:
 *           type: string
 *           readOnly: true
 *           example: "Mistral"
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
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    applicationDue: {
      type: Date,
      required: true,
    },
    location: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
    },
    workTimeType: [
      {
        type: String,
        enum: ["Part-time", "Full time"],
        required: true,
      },
    ],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      immutable: true,
    },
    companyName: {
      type: String,
      immutable: true,
    },
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);

export default Post;
