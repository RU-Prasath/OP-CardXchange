const express = require("express");
const router = express.Router();
const { submitLead, getLeads, updateLeadStatus, deleteLead, exportLeads } = require("../controllers/leadController");
const { protect } = require("../middleware/auth");

router.post("/", submitLead);
router.get("/", protect, getLeads);
router.get("/export", protect, exportLeads);
router.put("/:id", protect, updateLeadStatus);
router.delete("/:id", protect, deleteLead);

module.exports = router;
