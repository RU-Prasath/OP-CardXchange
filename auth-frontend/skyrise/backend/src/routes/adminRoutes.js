const express = require("express");
const router = express.Router();
const { login, getProfile, updateProfile, changePassword, getDashboardStats, createAdmin, getAllAdmins } = require("../controllers/adminController");
const { protect, superAdmin } = require("../middleware/auth");

router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/dashboard", protect, getDashboardStats);
router.post("/create", protect, superAdmin, createAdmin);
router.get("/all", protect, superAdmin, getAllAdmins);

module.exports = router;
