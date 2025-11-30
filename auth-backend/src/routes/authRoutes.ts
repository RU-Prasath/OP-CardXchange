import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/authController.js";
import { uploadProfile } from "../middleware/upload.js";

const router = express.Router();

// upload single profile photo with field name "profile"
router.post("/register", uploadProfile.single("profile"), register);

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
