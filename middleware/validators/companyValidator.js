/* eslint-disable import/prefer-default-export */
import { check, validationResult } from "express-validator";

const validateCompanyUpdate = [
  check("companyName")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Please provide a Company Name to update")
    .bail(),
  check("email")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Please provide an Email to update")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email address format')
    .bail(),
  check("password")
    .optional()
    .not()
    .isEmpty()
    .withMessage('Please provide a Password to update')
    .bail()
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must contain at least 5 characters'),
  check("industry")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Please provide an Industry to update")
    .bail()
    .isLength({ min: 2 })
    .withMessage('Industry field must contain at least 2 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export { validateCompanyUpdate };
