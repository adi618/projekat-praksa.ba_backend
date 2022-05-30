/* eslint-disable import/prefer-default-export */
import { check, validationResult } from "express-validator";

const validatePostCreation = [
  check("title")
    .exists()
    .withMessage("Please provide a Title")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Title cannot be empty")
    .bail(),
  check("description")
    .exists()
    .withMessage("Please provide a Description")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Description cannot be empty")
    .bail(),
  check("startDate")
    .exists()
    .withMessage("Please provide a Start date")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Start date cannot be empty")
    .bail()
    .isDate()
    .withMessage("Start date must be a valid date")
    .bail()
    .custom((value) => {
      const [startYear, startMonth, startDay] = value.split('-');
      const startDate = new Date(startYear, startMonth, startDay);
      const todayDate = new Date();
      if (startDate <= todayDate) throw new Error('Start date must be after todays date');
      return true;
    }),
  check("endDate")
    .exists()
    .withMessage("Please provide an End date")
    .bail()
    .not()
    .isEmpty()
    .withMessage("End date cannot be empty")
    .bail()
    .isDate()
    .withMessage("End date must be a valid date")
    .bail()
    .custom((value, { req }) => {
      const [startYear, startMonth, startDay] = req.body.startDate.split('-');
      const [endYear, endMonth, endDay] = value.split('-');

      const startDate = new Date(startYear, startMonth, startDay);
      const endDate = new Date(endYear, endMonth, endDay);

      if (endDate <= startDate) throw new Error('End date must be after start date');
      return true;
    }),
  check("applicationDue")
    .exists()
    .withMessage("Please provide an Application due date")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Application due date date cannot be empty")
    .bail()
    .isDate()
    .withMessage("Application due date must be a valid date")
    .bail()
    .custom((value, { req }) => {
      const [startYear, startMonth, startDay] = req.body.startDate.split('-');
      const [appDueYear, appDueMonth, appDueDay] = value.split('-');

      const startDate = new Date(startYear, startMonth, startDay);
      const applicationDueDate = new Date(appDueYear, appDueMonth, appDueDay);

      if (applicationDueDate <= startDate) throw new Error('Application due date must be after start date');
      return true;
    }),
  check("location")
    .exists()
    .withMessage("Please provide at least one location")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Locations cannot be empty")
    .bail(),
  check("location.*")
    .not()
    .isEmpty()
    .withMessage("A location cannot be empty")
    .bail(),
  check("category")
    .exists()
    .withMessage("Please provide a category")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Category cannot be empty")
    .bail(),
  check("workTimeType")
    .exists()
    .withMessage("Please provide at least one value")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Type of work cannot be empty")
    .bail(),
  check("workTimeType.*")
    .not()
    .isEmpty()
    .withMessage("Work time type cannot be empty")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validatePostUpdate = [
  check("title")
    .optional()
    .exists()
    .withMessage("Please provide a Title")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Title cannot be empty")
    .bail(),
  check("description")
    .optional()
    .exists()
    .withMessage("Please provide a Description")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Description cannot be empty")
    .bail(),
  check("startDate")
    .optional()
    .exists()
    .withMessage("Please provide a Start date")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Start date cannot be empty")
    .bail()
    .isDate()
    .withMessage("Start date must be a valid date")
    .bail()
    .custom((value) => {
      const [startYear, startMonth, startDay] = value.split('-');
      const startDate = new Date(startYear, startMonth, startDay);
      const todayDate = new Date();
      if (startDate <= todayDate) throw new Error('Start date must be after todays date');
      return true;
    }),
  check("endDate")
    .optional()
    .exists()
    .withMessage("Please provide an End date")
    .bail()
    .not()
    .isEmpty()
    .withMessage("End date cannot be empty")
    .bail()
    .isDate()
    .withMessage("End date must be a valid date")
    .bail()
    .custom((value, { req }) => {
      const [startYear, startMonth, startDay] = req.body.startDate.split('-');
      const [endYear, endMonth, endDay] = value.split('-');

      const startDate = new Date(startYear, startMonth, startDay);
      const endDate = new Date(endYear, endMonth, endDay);

      if (endDate <= startDate) throw new Error('End date must be after start date');
      return true;
    }),
  check("applicationDue")
    .optional()
    .exists()
    .withMessage("Please provide an Application due date")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Application due date date cannot be empty")
    .bail()
    .isDate()
    .withMessage("Application due date must be a valid date")
    .bail()
    .custom((value, { req }) => {
      const [startYear, startMonth, startDay] = req.body.startDate.split('-');
      const [appDueYear, appDueMonth, appDueDay] = value.split('-');

      const startDate = new Date(startYear, startMonth, startDay);
      const applicationDueDate = new Date(appDueYear, appDueMonth, appDueDay);

      if (applicationDueDate <= startDate) throw new Error('Application due date must be after start date');
      return true;
    }),
  check("location")
    .optional()
    .exists()
    .withMessage("Please provide at least one location")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Locations cannot be empty")
    .bail(),
  check("location.*")
    .optional()
    .not()
    .isEmpty()
    .withMessage("A location cannot be empty")
    .bail(),
  check("category")
    .optional()
    .exists()
    .withMessage("Please provide a category")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Category cannot be empty")
    .bail(),
  check("workTimeType")
    .optional()
    .exists()
    .withMessage("Please provide at least one value")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Type of work cannot be empty")
    .bail(),
  check("workTimeType.*")
    .not()
    .isEmpty()
    .withMessage("Work time type cannot be empty")
    .bail()
    .isIn(['Full time', 'Part-time'])
    .withMessage("Work time type must be a 'Full time' or 'Part-time'"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export { validatePostCreation, validatePostUpdate };
