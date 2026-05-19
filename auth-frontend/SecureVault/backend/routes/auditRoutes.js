import express from "express";
import {
  getMyAuditLogs,
  getAuditStats,
} from "../controllers/auditController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyAuditLogs);
router.get("/stats", getAuditStats);

export default router;