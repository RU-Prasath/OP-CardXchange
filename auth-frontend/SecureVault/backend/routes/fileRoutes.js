import express from 'express';
import { uploadFile, getMyFiles, getFileById, deleteFile, downloadFile, previewFile, shareFile, getFilesSharedWithMe, getFileShares, revokeShare, getFileStats } from '../controllers/fileController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All file routes require authentication
router.use(protect);

router.get("/stats", getFileStats);
router.get("/shared/with-me", getFilesSharedWithMe);

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getMyFiles);

router.get('/:id', getFileById);
router.delete('/:id', deleteFile);
router.post('/:id/download', downloadFile);
router.post('/:id/preview', previewFile);

router.post("/:id/share", shareFile);
router.get("/:id/shares", getFileShares);
router.delete("/:id/shares/:userId", revokeShare);

export default router;