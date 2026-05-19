import AuditLog from "../models/AuditLog.js";

/**
 * Log an audit event
 * Designed to NEVER throw — auditing must not break the main flow
 */
export const logAudit = async ({
  userId,
  action,
  description,
  file = null,
  fileName = null,
  metadata = null,
  status = "SUCCESS",
  req = null,
}) => {
  try {
    const ipAddress = req
      ? req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket?.remoteAddress ||
        "unknown"
      : null;
    const userAgent = req?.headers["user-agent"] || null;

    await AuditLog.create({
      user: userId,
      action,
      description,
      file,
      fileName,
      metadata,
      status,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    // Audit logging should never fail the main operation
    console.error("⚠️  Audit log error (non-fatal):", error.message);
  }
};