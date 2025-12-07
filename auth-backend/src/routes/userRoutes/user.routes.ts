import express from "express";
import { getAllUsers, getUserById } from "../../controllers/userController/user.controller.js";
import { adminProtect, protect } from "../../config/middleware/auth.js";

const router = express.Router();

// ✅ GET ALL USERS (ADMIN ONLY)
router.get("/all-users", protect, adminProtect, getAllUsers);
// ✅ GET USER BY ID (ADMIN)
router.get("/:id", protect, adminProtect, getUserById);

export default router;
