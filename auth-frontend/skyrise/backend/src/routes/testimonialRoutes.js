const express = require("express");
const router = express.Router();
const { createUpload } = require("../middleware/upload");
const { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require("../controllers/testimonialController");
const { protect } = require("../middleware/auth");

const upload = createUpload("testimonials");

router.get("/", getTestimonials);
router.post("/", protect, upload, createTestimonial);
router.put("/:id", protect, upload, updateTestimonial);
router.delete("/:id", protect, deleteTestimonial);

module.exports = router;
