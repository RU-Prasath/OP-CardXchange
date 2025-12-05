import express from "express";
import {
  createCard,
  listApprovedCards,
  listPendingCards,
  updateCardStatus
} from "../controllers/cardController.js";
import { protect, adminProtect } from "../middleware/auth.js";
import { uploadCards } from "../middleware/uploadMultiple.js";

const router = express.Router();

router.get("/", listApprovedCards); // public
router.post("/", protect, uploadCards.array("images", 12), createCard); // up to 12 images

// admin routes
router.get("/pending", protect, adminProtect, listPendingCards);
router.patch("/:id/status", protect, adminProtect, updateCardStatus);

export default router;
