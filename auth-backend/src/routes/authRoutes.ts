import express from "express";
import { uploadProfile } from "../utils/storage/upload.js";
import { forgotPassword, login, register, resetPassword, sendEmailOtp, verifyEmailOtpWithUpload } from "../controllers/auth/auth.controller.js";

const router = express.Router();

router.post("/register", uploadProfile.single("profile"), register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/send-otp", sendEmailOtp);
router.post("/verify-otp", verifyEmailOtpWithUpload);
// router.post("/verify-reset-otp", verifyResetOtp);

export default router;
