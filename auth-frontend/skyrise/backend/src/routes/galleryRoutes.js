const express = require("express");
const router = express.Router();
const { createUpload } = require("../middleware/upload");
const { getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = require("../controllers/galleryController");
const { protect } = require("../middleware/auth");

const upload = createUpload("gallery");

router.get("/", getGallery);
router.post("/", protect, upload, addGalleryItem);
router.put("/:id", protect, upload, updateGalleryItem);
router.delete("/:id", protect, deleteGalleryItem);

module.exports = router;
