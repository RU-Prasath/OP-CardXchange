import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import File from "../models/File.js";
import { encryptFile, decryptFile, encryptAESKeyWithRSA, decryptAESKeyWithRSA, generateAESKey, generateIV, generateFileHash, decryptPrivateKey } from "../utils/cryptoUtils.js";
import User from "../models/User.js";
import { logAudit } from "../utils/auditLogger.js";


// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to uploads folder
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * @desc    Upload and encrypt a file
 * @route   POST /api/files/upload
 * @access  Private
 */
export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file provided",
            });
        }

        const { originalname, mimetype, size, buffer } = req.file;
        const user = req.user;

        console.log(`Uploading file: ${originalname} (${size} bytes)`);

        // 1. Generate file hash BEFORE encryption (for integrity check later)
        const fileHash = generateFileHash(buffer);

        // 2. Generate random AES-256 key and IV for this file
        const aesKey = generateAESKey();
        const iv = generateIV();

        // 3. Encrypt the file with AES-256-GCM
        const { encryptedData, authTag } = encryptFile(buffer, aesKey, iv);

        // 4. Encrypt the AES key with user's RSA public key
        const encryptedAESKey = encryptAESKeyWithRSA(aesKey, user.publicKey);

        // 5. Save encrypted file to disk
        const encryptedFileName = `${Date.now()}-${user._id}-${originalname}.enc`;
        const storagePath = path.join(UPLOAD_DIR, encryptedFileName);
        fs.writeFileSync(storagePath, encryptedData);

        // 6. Save metadata to MongoDB
        const file = await File.create({
            owner: user._id,
            originalName: originalname,
            mimeType: mimetype,
            originalSize: size,
            encryptedSize: encryptedData.length,
            storagePath: encryptedFileName,
            encryptedAESKey: encryptedAESKey.toString("hex"),
            iv: iv.toString("hex"),
            authTag: authTag.toString("hex"),
            fileHash,
        });

        console.log(`File encrypted and stored: ${encryptedFileName}`);

        await logAudit({
            userId: user._id,
            action: "FILE_UPLOAD",
            description: `Uploaded "${originalname}"`,
            file: file._id,
            fileName: originalname,
            metadata: { size: file.originalSize, mimeType: file.mimeType },
            req,
        });

        return res.status(201).json({
            success: true,
            message: "File uploaded and encrypted successfully",
            file: {
                _if: file._id,
                originalName: file.originalName,
                mimeType: file.mimeType,
                size: file.originalSize,
                encryptedSize: file.encryptedSize,
                createdAt: file.createdAt,
            },
        });
    } catch (error) {
        console.error("Error uploading file:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to upload file",
            error: error.message,
        });
    }
};

/**
 * @desc    Get all files owned by the current user
 * @route   GET /api/files
 * @access  Private
 */
export const getMyFiles = async (req, res) => {
    try {
        const files = (await File.find({ owner: req.user._id })
            .select("-encryptedAESKey -iv -authTag -storagePath -fileHash"))
            .sort((a, b) => b.createdAt - a.createdAt); // ✅ Descending order

        return res.status(200).json({
            success: true,
            count: files.length,
            files,
        });
    } catch (error) {
        console.error("Error fetching my files:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch my files",
            error: error.message,
        });
    }
};

/**
 * @desc    Get a single file's metadata
 * @route   GET /api/files/:id
 * @access  Private
 */
export const getFileById = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        // Check if user is owner or has been shared the file
        const isOwner = file.owner.toString() === req.user._id.toString();
        const isShared = file.sharedWith.some(
            (s) => s.user.toString() === req.user._id.toString()
        );

        if (!isOwner && !isShared) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to access this file",
            });
        }

        return res.status(200).json({
            success: true,
            file: {
                _id: file._id,
                originalName: file.originalName,
                mimeType: file.mimeType,
                originalSize: file.originalSize,
                encryptedSize: file.encryptedSize,
                createdAt: file.createdAt,
                isOwner,
            },
        });
    } catch (error) {
        console.error("Error fetching file by id:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch file by id",
            error: error.message,
        });
    }
};

/**
 * @desc    Delete a file
 * @route   DELETE /api/files/:id
 * @access  Private
 */
export const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        // Only the owner can delete
        if (file.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this file",
            });
        }

        // Delete encrypted file from disk
        const fullPath = path.join(UPLOAD_DIR, file.storagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        // Delete metadata from DB
        await file.deleteOne();

        console.log(`File deleted: ${file.originalName}`);

        await logAudit({
            userId: req.user._id,
            action: "FILE_DELETE",
            description: `Deleted "${file.originalName}"`,
            fileName: file.originalName,
            req,
        });

        return res.status(200).json({
            success: true,
            message: "File deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting file:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to delete file",
            error: error.message,
        });
    }
};

/**
 * @desc    Download and decrypt a file
 * @route   POST /api/files/:id/download
 * @access  Private
 * @body    { password: "user's account password" }
 *
 * Note: We use POST instead of GET because we need to send password in body.
 */
export const downloadFile = async (req, res) => {
    try {
        const { password } = req.body;
        const fileId = req.params.id;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required to decrypt the file",
            });
        }

        // Find the file
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        // Check authorization
        const isOwner = file.owner.toString() === req.user._id.toString();
        const sharedEntry = file.sharedWith.find(
            (s) => s.user.toString() === req.user._id.toString(),
        );

        if (!isOwner && !sharedEntry) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to access this file",
            });
        }

        console.log(`Downloading file: ${file.originalName}`);

        // Get the user's full record (including encrypted private key)
        const user = await User.findById(req.user._id).select("+password");

        // Verify password before decrypting anything
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            await logAudit({
                userId: req.user._id,
                action: "FAILED_DOWNLOAD",
                description: `Failed download of "${file.originalName}" — incorrect password`,
                file: file._id,
                fileName: file.originalName,
                status: "FAILURE",
                req,
            });
            return res.status(401).json({
                success: false,
                message: "Incorrect password",
            });
        }

        // 1. Decrypt the user's RSA private key using their password
        const privateKey = decryptPrivateKey(
            user.encryptedPrivateKey,
            password,
            user.privateKeySalt,
            user.privateKeyIV
        );

        // 2. Get the right encrypted AES key (owner's copy OR shared copy)
        const encryptedAESKeyHex = isOwner ? file.encryptedAESKey : sharedEntry.encryptedAESKey;

        // 3. Decrypt the AES key using RSA private key
        const aesKey = decryptAESKeyWithRSA(
            Buffer.from(encryptedAESKeyHex, "hex"),
            privateKey
        );

        //4. Read the encrypted file from disk
        const fullPath = path.join(UPLOAD_DIR, file.storagePath);
        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({
                success: false,
                message: "Encrypted file missing from storage",
            });
        }

        const encryptedData = fs.readFileSync(fullPath);

        // 5. Decrypt the file using AES-256-GCM
        const iv = Buffer.from(file.iv, "hex");
        const authTag = Buffer.from(file.authTag, "hex");

        let decryptedData;
        try {
            decryptedData = decryptFile(encryptedData, aesKey, iv, authTag);
        } catch (error) {
            console.error("Decryption failed (file tampered?):", error.message);
            return res.status(500).json({
                success: false,
                message: "file decryption failed - file may have been tampered with or corrupted",
            });
        }

        // 6. Verify integrity using SHA-256 hash
        const computedHash = generateFileHash(decryptedData);
        if (computedHash !== file.fileHash) {
            console.error("Hash mismatch - integrity check failed");
            return res.status(500).json({
                success: false,
                message: "File integrity check failed",
            });
        }

        console.log(`File decrypted successfully: ${file.originalName}`);

        await logAudit({
            userId: req.user._id,
            action: "FILE_DOWNLOAD",
            description: `Downloaded "${file.originalName}"${
                isOwner ? "" : " (shared)"
            }`,
            file: file._id,
            fileName: file.originalName,
            req,
        });

        // 7. Send the decrypted file to client
        res.setHeader("Content-Type", file.mimeType);
        res.setHeader("Content-Dispoition", `attachment; filename="${encodeURIComponent(file.originalName)}"`);
        res.setHeader("Content-Length", decryptedData.length);

        return res.send(decryptedData);
    } catch (error) {
        const fileId = req.params.id;

        // Find the file
        const file = await File.findById(fileId);
        await logAudit({
            userId: req.user._id,
            action: "FAILED_DOWNLOAD",
            description: `Decryption failed for "${file.originalName}"`,
            file: file._id,
            fileName: file.originalName,
            status: "FAILURE",
            req,
        });
        console.error("Error downloading file:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to download file",
            error: error.message,
        });
    }
};

/**
 * @desc    Preview file in browser (e.g., images, PDFs) — same as download but inline
 * @route   POST /api/files/:id/preview
 * @access  Private
 */
export const previewFile = async (req, res) => {
    try {
        const { password } = req.body;
        const fileId = req.params.id;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            });
        }

        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        const isOwner = file.owner.toString() === req.user._id.toString();
        const sharedEntry = file.sharedWith.find(
            (s) => s.user.toString() === req.user._id.toString()
        );

        if (!isOwner && !sharedEntry) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to access this file",
            });
        }

        const user = await User.findById(req.user._id).select("+password");

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password",
            });
        }

        const privateKey = decryptPrivateKey(
            user.encryptedPrivateKey,
            password,
            user.privateKeySalt,
            user.privateKeyIV
        );

        const encryptedAESKeyHex = isOwner ? file.encryptedAESKey : sharedEntry.encryptedAESKey;

        const aesKey = decryptAESKeyWithRSA(
            Buffer.from(encryptedAESKeyHex, "hex"),
            privateKey
        );

        const fullPath = path.join(UPLOAD_DIR, file.storagePath);
        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({
                success: false,
                message: "Encrypted file missing from storage",
            });
        }

        const encryptedData = fs.readFileSync(fullPath);
        const iv = Buffer.from(file.iv, "hex");
        const authTag = Buffer.from(file.authTag, "hex");

        let decryptedData;
        try {
            decryptedData = decryptFile(encryptedData, aesKey, iv, authTag);
        } catch (error) {
            console.error("Decryption failed (file tampered?):", error.message);
            return res.status(500).json({
                success: false,
                message: "File decryption failed - file may have been tampered with or corrupted",
            });
        }

        // Verify integrity
        const computedHash = generateFileHash(decryptedData);
        if (computedHash !== file.fileHash) {
            console.error("Hash mismatch - integrity check failed");
            return res.status(500).json({
                success: false,
                message: "File integrity check failed",
            });
        }

        console.log(`File previewed successfully: ${file.originalName}`);

        // Send inline (for browser preview)
        res.setHeader("Content-Type", file.mimeType);
        res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.originalName)}"`);
        res.setHeader("Content-Length", decryptedData.length);

        return res.send(decryptedData);
    } catch (error) {
        console.error("Error previewing file:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to preview file",
            error: error.message,
        });
    }
};

/**
 * @desc    Share a file with another user
 * @route   POST /api/files/:id/share
 * @access  Private
 * @body    { password: "owner's password", recipientEmail: "user@example.com" }
 */
export const shareFile = async (req, res) => {
    try{
        const { password, recipientEmail } = req.body;
        const fileId = req.params.id;

        if (!password || !recipientEmail) {
            return res.status(400).json({
                success: false,
                message: "Password and recipient email are required",
            });
        }

        // Find the file
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        // Only the OWNER can share
        if (file.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the owner can share this file",
            });
        }

        // Get the owner's full record (with private key)
        const owner = await User.findById(req.user._id).select("+password");

        // Verify owner's password
        const isPasswordValid = await owner.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password",
            });
        }

        // Find the recipient
        const recipient  = await User.findOne({
            email: recipientEmail.toLowerCase().trim(),
        });

        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "Recipient user not found. They need to register first.",
            });
        }

        // Can't share with yourself
        if (recipient._id.toString() === owner._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot share a file with yourself",
            });
        }

        // Check if already shared with this user
        const alreadyShared = file.sharedWith.some(
            (s) => s.user.toString() === recipient._id.toString(),
        );

        if (alreadyShared) {
            return res.status(400).json({
                success: false,
                message: `File is already shared with ${recipient.email}`
            });
        }

        console.log(`Sharing "${file.originalName}" with ${recipient.email}...`);

        // 1. Decrypt the owner's RSA private key using their password
        const ownerPrivateKey = decryptPrivateKey(
            owner.encryptedPrivateKey,
            password,
            owner.privateKeySalt,
            owner.privateKeyIV
        );

        // 2. Decrypt the AES the using owner's RSA private key
        const aesKey = decryptAESKeyWithRSA(
            Buffer.from(file.encryptedAESKey, "hex"),
            ownerPrivateKey
        );

        // 3. Re-encrypt the AES key using the recipient's RSA public key
        const reencryptedAESKey = encryptAESKeyWithRSA(
            aesKey,
            recipient.publicKey
        );

        // 4. Add the recipient to the sharedWith array
        file.sharedWith.push({
            user: recipient._id,
            encryptedAESKey: reencryptedAESKey.toString("hex"),
            sharedAt: new Date(),
        });

        await file.save();

        console.log(`File shared successfully with ${recipient.email}`);

        await logAudit({
            userId: owner._id,
            action: "FILE_SHARE",
            description: `Shared "${file.originalName}" with ${recipient.email}`,
            file: file._id,
            fileName: file.originalName,
            metadata: { recipientEmail: recipient.email, recipientName: recipient.name },
            req,
        });

        return res.status(200).json({
            success: true,
            message: `File shared successfully with ${recipient.email}`,
            sharedWith: {
                email: recipient.email,
                name: recipient.name,
                sharedAt: new Date(),
            },
        });
    } catch(error){
        console.error("Error sharing file:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to share file",
            error: error.message,
        });
    }
};

/**
 * @desc    Revoke file sharing for a specific user
 * @route   DELETE /api/files/:id/share/:userId
 * @access  Private (owner only)
 */
export const revokeShare = async (req, res) => {
    try {
        const { id: fileId, userId } = req.params;

        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        if (file.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the owner can revoke sharing",
            });
        }

        const initialLength = file.sharedWith.length;
        file.sharedWith = file.sharedWith.filter(
            (s) => s.user.toString() !== userId
        );

        if (file.sharedWith.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "User was not in the share list",
            });
        }

        await file.save();

        console.log(`Revoked shared access for user ${userId}`);

        await logAudit({
            userId: req.user._id,
            action: "SHARE_REVOKE",
            description: `Revoked share access for "${file.originalName}"`,
            file: file._id,
            fileName: file.originalName,
            metadata: { revokedUserId: userId },
            req,
        });

        return res.status(200).json({
            success: true,
            message: "Share access revoked successfully",
        });
    } catch (error) {
        console.error("Error revoking share:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to revoke share",
            error: error.message,
        });
    }
};

/**
 * @desc    Get all files shared WITH me (by other users)
 * @route   GET /api/files/shared/with-me
 * @access  Private
 */
export const getFilesSharedWithMe = async (req, res) => {
    try {
        const files = await File.find({
            "sharedWith.user": req.user._id,
        })
        .populate("owner", "name email")
        .select("-encryptedAESKey -iv -authTag -storagePath -fileHash")
        .sort({ "sharedWith.sharedAt": -1 });

        return res.status(200).json({
            success: true,
            count: files.length,
            files,
        });
    } catch (error) {
        console.error("Error fetching shared files:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch shared files",
            error: error.message,
        });
    }
};

/**
 * @desc    Get list of users a specific file is shared with
 * @route   GET /api/files/:id/shares
 * @access  Private (owner only)
 */
export const getFileShares = async (req, res) => {
    try {
        const file = await File.findById(req.params.id).populate("sharedWith.user", "name email");

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        if (file.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the owner can view share list",
            });
        }

        const shares = file.sharedWith.map((s) => ({
            _id: s.user._id,
            name: s.user.name,
            email: s.user.email,
            sharedAt: s.sharedAt,
        }));

        return res.status(200).json({
            success: true,
            count: shares.length,
            shares,
        });
    } catch (error) {
        console.error("Error fetching file shares:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch file shares",
            error: error.message,
        });
    }
};

/**
 * @desc    Get file statistics for the current user
 * @route   GET /api/files/stats
 * @access  Private
 */
export const getFileStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Run all queries in parallel
    const [
      myFiles,
      sharedWithMeCount,
      activeShares,
    ] = await Promise.all([
      // Get all files owned by user (for size aggregation)
      File.find({ owner: userId }).select(
        "originalSize encryptedSize mimeType sharedWith createdAt"
      ),
      // Count files shared WITH me by others
      File.countDocuments({ "sharedWith.user": userId }),
      // Count files I have actively shared (sharedWith array non-empty)
      File.countDocuments({
        owner: userId,
        "sharedWith.0": { $exists: true },
      }),
    ]);

    // Aggregate stats from my files
    const totalFiles = myFiles.length;
    const totalOriginalSize = myFiles.reduce(
      (sum, f) => sum + f.originalSize,
      0
    );
    const totalEncryptedSize = myFiles.reduce(
      (sum, f) => sum + f.encryptedSize,
      0
    );
    const avgFileSize = totalFiles > 0 ? totalOriginalSize / totalFiles : 0;

    // File type breakdown
    const typeBreakdown = myFiles.reduce((acc, file) => {
      let category = "Other";
      const mime = file.mimeType;
      if (mime.startsWith("image/")) category = "Images";
      else if (mime.startsWith("video/")) category = "Videos";
      else if (mime.startsWith("audio/")) category = "Audio";
      else if (mime === "application/pdf") category = "PDFs";
      else if (mime.includes("word") || mime.includes("document"))
        category = "Documents";
      else if (mime.includes("sheet") || mime.includes("excel"))
        category = "Spreadsheets";
      else if (mime.startsWith("text/")) category = "Text";
      else if (mime.includes("zip") || mime.includes("compressed"))
        category = "Archives";

      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Recent uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUploads = myFiles.filter(
      (f) => new Date(f.createdAt) >= sevenDaysAgo
    ).length;

    return res.status(200).json({
      success: true,
      stats: {
        totalFiles,
        totalOriginalSize,
        totalEncryptedSize,
        avgFileSize: Math.round(avgFileSize),
        sharedWithMe: sharedWithMeCount,
        activeShares,
        recentUploads,
        typeBreakdown,
      },
    });
  } catch (error) {
    console.error("❌ GetFileStats Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};