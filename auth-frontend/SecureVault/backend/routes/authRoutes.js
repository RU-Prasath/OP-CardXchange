import express from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser, forgotPassword } from '../controllers/authController.js';
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/logout", logoutUser);
router.get("/me", protect, getCurrentUser);

export default router;
