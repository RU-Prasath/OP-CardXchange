import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        originalSize: {
            type: Number,
            required: true,
        },
        encryptedSize: {
            type: Number,
            required: true,
        },
        storagePath: {
            type: String,
            required: true,
        },
        // AES key (encrypted with owner's RSA public key) - hex string
        encryptedAESKey: {
            type: String,
            required: true,
        },
        // IV used during AES encryption - hex string
        iv: {
            type: String,
            required: true,
        },
        // GCM authentication tag - hex string (integrity check)
        authTag: {
            type: String,
            required: true,
        },
        // SHA-256 hash of original file (for integrity verification)
        fileHash: {
            type: String,
            required: true,
        },
        // Users this file have been shared with
        sharedWith: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                encryptedAESKey: {
                    type: String,
                },
                sharedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

export default File;