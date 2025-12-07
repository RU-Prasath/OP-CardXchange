import express from "express";
import {
  createCard,
  listApprovedCards,
  listPendingCards,
  listRejectedCards,
  updateCardStatus
} from "../../../controllers/cardController/opCardController/cardController.js";
import { protect, adminProtect } from "../../../middleware/auth.js";
import { uploadCards } from "../../../middleware/uploadMultiple.js";
import { getCardById, listAllCards } from "../../../controllers/cardController/opCardController/cardController.js";

const router = express.Router();

router.get("/", listApprovedCards); // public
router.get("/rejected", listRejectedCards); // public
router.post("/", protect, uploadCards.array("images", 12), createCard); // up to 12 images

// admin routes
router.get("/pending", protect, adminProtect, listPendingCards);
router.patch("/:id/status", protect, adminProtect, updateCardStatus);

// ✅ Admin: list all cards with optional query params
// Example: /api/admin/cards?status=pending&category=one-piece&search=Garp
router.get("/", listAllCards);

// ✅ Admin: get single card details
router.get("/:id", getCardById);

export default router;
