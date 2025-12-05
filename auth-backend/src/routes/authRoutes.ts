import express from "express";
import { register, login, forgotPassword, resetPassword, sendEmailOtp, verifyEmailOtp } from "../controllers/authController.js";
import { uploadProfile } from "../middleware/upload.js";

const router = express.Router();

// upload single profile photo with field name "profile"
router.post("/register", uploadProfile.single("profile"), register);

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/send-otp", sendEmailOtp);
router.post("/verify-otp", verifyEmailOtp);


export default router;
