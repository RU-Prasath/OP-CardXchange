const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { getServices, getServiceBySlug, createService, updateService, deleteService } = require("../controllers/serviceController");
const { protect } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../uploads/services");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname).toLowerCase()}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
const serviceUpload = upload.fields([{ name: "image", maxCount: 1 }, { name: "heroImage", maxCount: 1 }]);

router.get("/", getServices);
router.get("/:slug", getServiceBySlug);
router.post("/", protect, serviceUpload, createService);
router.put("/:id", protect, serviceUpload, updateService);
router.delete("/:id", protect, deleteService);

module.exports = router;
