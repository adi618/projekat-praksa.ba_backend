import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *        - companyName
 *        - email
 *        - password
 *       properties:
 *         companyName:
 *           type: string
 *           example: "Company LLC"
 *         profilePhoto:
 *           type: string
 *           readOnly: true
 *           default: ""
 *         email:
 *           type: string
 *           format: email
 *           example: "email@email.com"
 *         password:
 *           type: string
 *           writeOnly: true
 *           format: password
 *           example: "Password123%"
 */
const companySchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    industry: {
      type: String,
      required: true,
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false,
      immutable: true,
    },
  },
  { timestamps: true },
);

const Company = mongoose.model("Company", companySchema);

export default Company;
