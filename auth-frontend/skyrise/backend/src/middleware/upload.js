const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, "../../uploads", folder);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });

const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG, and WEBP files are allowed"), false);
  }
};

const createUpload = (folder, fieldName = "image", maxCount = 1) => {
  const upload = multer({
    storage: createStorage(folder),
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  });
  return maxCount === 1 ? upload.single(fieldName) : upload.array(fieldName, maxCount);
};

const deleteFile = (filePath) => {
  if (!filePath) return;
  const fullPath = path.join(__dirname, "../../", filePath.replace(/^\//, ""));
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error("File delete error:", err.message);
    });
  }
};

module.exports = { createUpload, deleteFile };
