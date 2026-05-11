const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { getProjects, getProjectById, createProject, updateProject, deleteProject } = require("../controllers/projectController");
const { protect } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../uploads/projects");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname).toLowerCase()}`),
});
const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  allowed.includes(path.extname(file.originalname).toLowerCase()) ? cb(null, true) : cb(new Error("Invalid file type"));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const projectUpload = upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "images", maxCount: 10 }]);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", protect, projectUpload, createProject);
router.put("/:id", protect, projectUpload, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
