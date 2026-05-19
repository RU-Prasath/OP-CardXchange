import multer from "multer";

// use memory storage - we want the file in memory to encrypt it before saving
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Accept all file types (it's a secure vault for any file)
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max
    },
});

export default upload;