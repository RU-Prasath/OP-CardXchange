const express = require("express");
const router = express.Router();
const { createUpload } = require("../middleware/upload");
const { getSlides, getAllSlides, createSlide, updateSlide, deleteSlide } = require("../controllers/heroSlideController");
const { protect } = require("../middleware/auth");

const upload = createUpload("hero");

router.get("/", getSlides);
router.get("/all", protect, getAllSlides);
router.post("/", protect, upload, createSlide);
router.put("/:id", protect, upload, updateSlide);
router.delete("/:id", protect, deleteSlide);

module.exports = router;
