import express from "express";
import { adminProtect, protect } from "../../middleware/auth.js";
import { getAllUsers, getUserById } from "../../controllers/userController/user.controller.js";

const router = express.Router();

// ✅ GET ALL USERS (ADMIN ONLY)
router.get("/all-users", protect, adminProtect, getAllUsers);
// ✅ GET USER BY ID (ADMIN)
router.get("/:id", protect, adminProtect, getUserById);

export default router;
