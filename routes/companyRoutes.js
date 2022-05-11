import { Router } from "express";

import {
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getCompanies);
router.get("/:id", getCompany);
router.put("/:id", protect, updateCompany);
router.delete("/:id", protect, deleteCompany);

export default router;
