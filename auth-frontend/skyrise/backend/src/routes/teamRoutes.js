const express = require("express");
const router = express.Router();
const { createUpload } = require("../middleware/upload");
const { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } = require("../controllers/teamController");
const { protect } = require("../middleware/auth");

const upload = createUpload("team");

router.get("/", getTeam);
router.post("/", protect, upload, createTeamMember);
router.put("/:id", protect, upload, updateTeamMember);
router.delete("/:id", protect, deleteTeamMember);

module.exports = router;
