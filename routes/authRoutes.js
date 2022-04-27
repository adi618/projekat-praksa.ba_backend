import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { upload } from "../middleware/images.js";

const router = Router();

router.post("/login", login);
router.post("/register", upload.single("profilePicture"), register);

export default router;
