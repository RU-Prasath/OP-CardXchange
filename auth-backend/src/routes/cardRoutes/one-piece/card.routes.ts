// import express from "express";
// import {
//   createCard,
//   listApprovedCards,
//   listPendingCards,
//   listRejectedCards,
//   updateCardStatus
// } from "../../../controllers/cardController/one-piece/card.controller.js";
// import { protect, adminProtect } from "../../../middleware/auth.js";
// import { uploadCards } from "../../../middleware/uploadMultiple.js";
// import { getCardById, listAllCards } from "../../../controllers/cardController/one-piece/card.controller.js";

// const router = express.Router();

// router.get("/", listApprovedCards); // public
// router.get("/rejected", listRejectedCards); // public
// router.post("/", protect, uploadCards.array("images", 12), createCard); // up to 12 images

// // admin routes
// router.get("/pending", protect, adminProtect, listPendingCards);
// router.patch("/:id/status", protect, adminProtect, updateCardStatus);

// // ✅ Admin: list all cards with optional query params
// // Example: /api/admin/cards?status=pending&category=one-piece&search=Garp
// router.get("/", listAllCards);

// // ✅ Admin: get single card details
// router.get("/:id", getCardById);

// export default router;

// import express from "express";
// import { createCard, getCardById, getCardStats, listAllCards, listApprovedCards, listPendingCards, listRejectedCards, updateCardStatus } from "../../../controllers/cardController/one-piece/card.controller.js";
// import { adminProtect, protect } from "../../../config/middleware/auth.js";
// import { uploadCards } from "../../../utils/storage/uploadMultiple.js";

// const router = express.Router();

// // Public routes
// router.get("/", listApprovedCards);
// router.get("/stats", getCardStats);

// // Protected routes (seller)
// router.post("/", protect, uploadCards.array("images", 12), createCard);

// // Admin routes
// router.get("/admin/all", protect, adminProtect, listAllCards);
// router.get("/admin/pending", protect, adminProtect, listPendingCards);
// router.get("/admin/rejected", protect, adminProtect, listRejectedCards);
// router.get("/admin/:id", protect, adminProtect, getCardById);
// router.patch("/admin/:id/status", protect, adminProtect, updateCardStatus);

// export default router;

// 11/12 10:52
// import express from "express";
// import { createCard, getCardById, getCardStats, listAllCards, listApprovedCards, listApprovedCardsByUserId, listPendingCards, listPendingCardsByUserId, listRejectedCards, listRejectedCardsByUserId, updateCardStatus } from "../../../controllers/cardController/one-piece/card.controller.js";
// import { adminProtect, protect } from "../../../config/middleware/auth.js";
// import { uploadCards } from "../../../utils/storage/uploadMultiple.js";

// const router = express.Router();

// // Public routes
// router.get("/", listApprovedCards);
// router.get("/stats", getCardStats);

// // Protected routes (seller)
// router.post("/", protect, uploadCards.array("images", 12), createCard);

// // User-specific card status routes
// router.get("/my/pending", protect, listPendingCardsByUserId);
// router.get("/my/approved", protect, listApprovedCardsByUserId);
// router.get("/my/rejected", protect, listRejectedCardsByUserId);

// // Admin routes
// router.get("/", protect, adminProtect, listAllCards);
// router.get("/pending", protect, adminProtect, listPendingCards);
// router.get("/rejected", protect, adminProtect, listRejectedCards);
// router.get("/:id", getCardById);
// router.patch("/:id/status", protect, adminProtect, updateCardStatus);

// export default router;

// routes/card/one-piece/card.routes.ts
import express from "express";
import { 
  createCard, 
  getCardById, 
  getCardStats, 
  listAllCards, 
  listApprovedCards, 
  listPendingCards, 
  listRejectedCards, 
  updateCardStatus,
  listPendingCardsByUserId,
  listApprovedCardsByUserId,
  listRejectedCardsByUserId,
  deleteMyCard,
  deleteCard
} from "../../../controllers/cardController/one-piece/card.controller.js";
import { adminProtect, protect } from "../../../config/middleware/auth.js";
import { uploadCards } from "../../../utils/storage/uploadMultiple.js";

const router = express.Router();

// Public routes
router.get("/", listApprovedCards);
router.get("/stats", getCardStats);

// Protected routes (seller)
router.post("/", protect, uploadCards.array("images", 12), createCard);
router.delete("/my/:id", protect, deleteMyCard); // User delete own card

// User-specific card status routes
router.get("/my/pending", protect, listPendingCardsByUserId);
router.get("/my/approved", protect, listApprovedCardsByUserId);
router.get("/my/rejected", protect, listRejectedCardsByUserId);

// Admin routes
router.get("/all", protect, adminProtect, listAllCards);
router.get("/pending", protect, adminProtect, listPendingCards);
router.get("/rejected", protect, adminProtect, listRejectedCards);
router.get("/:id", getCardById);
router.patch("/:id/status", protect, adminProtect, updateCardStatus);
router.delete("/:id", protect, adminProtect, deleteCard); // Admin delete any card

export default router;