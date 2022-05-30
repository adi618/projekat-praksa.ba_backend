/* eslint-disable import/prefer-default-export */
import { check, validationResult } from "express-validator";

const validateRegistration = [
  check("companyName")
    .exists()
    .withMessage("Please provide a Company Name")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Company Name cannot be empty")
    .bail(),
  check("email")
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage('Email field cannot be empty')
    .bail()
    .isEmail()
    .withMessage('Invalid email address format')
    .bail(),
  check("password")
    .not()
    .isEmpty()
    .withMessage('Password field cannot be empty')
    .bail()
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must contain at least 5 characters'),
  check("confirmPassword")
    .exists()
    .withMessage("confirmPassword field cannot be empty")
    .bail()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("passwordConfirmation field must have the same value as the password field"),
  check("industry")
    .exists({ checkFalsy: true })
    .withMessage("Industy field must contain a string value")
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

const validateLogin = [
  check("email")
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage('Email field cannot be empty')
    .bail()
    .isEmail()
    .withMessage('Invalid email address format')
    .bail(),
  check("password")
    .not()
    .isEmpty()
    .withMessage('Password field cannot be empty')
    .bail()
    .isLength({ min: 5 })
    .withMessage('Password must contain at least 5 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export { validateRegistration, validateLogin };
