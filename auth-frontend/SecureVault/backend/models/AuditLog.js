import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "REGISTER",
        "LOGIN",
        "LOGOUT",
        "PASSWORD_RECOVERY",
        "FILE_UPLOAD",
        "FILE_DOWNLOAD",
        "FILE_DELETE",
        "FILE_SHARE",
        "SHARE_REVOKE",
        "FAILED_DOWNLOAD",
        "FAILED_SHARE",
        "FAILED_LOGIN",
      ],
    },
    // Human-readable summary
    description: {
      type: String,
      required: true,
    },
    // Optional related file
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
    fileName: {
      type: String, // Stored as snapshot in case file is later deleted
    },
    // Optional metadata (e.g., recipient email for shares)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    // Whether the action was successful
    status: {
      type: String,
      enum: ["SUCCESS", "FAILURE"],
      default: "SUCCESS",
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index for fast querying by user + date
auditLogSchema.index({ user: 1, createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;