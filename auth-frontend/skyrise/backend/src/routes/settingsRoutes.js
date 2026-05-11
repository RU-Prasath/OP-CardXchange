const express = require("express");
const router = express.Router();
const { createUpload } = require("../middleware/upload");
const { getSettings, getSettingsByGroup, updateSetting, updateSettingsBulk, uploadLogo } = require("../controllers/settingsController");
const { protect } = require("../middleware/auth");

const upload = createUpload("hero");

router.get("/", getSettings);
router.get("/group/:group", getSettingsByGroup);
router.put("/", protect, updateSetting);
router.put("/bulk", protect, updateSettingsBulk);
router.post("/logo", protect, upload, uploadLogo);

module.exports = router;
