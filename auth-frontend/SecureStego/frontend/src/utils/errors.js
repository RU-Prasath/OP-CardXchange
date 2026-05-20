/**
 * Extract a user-friendly error message from an axios error.
 * FastAPI uses 'detail' for errors; we also handle plain strings and 'message'.
 */
export const getErrorMessage = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;

  if (!data) return error?.message || fallback;
  if (typeof data === "string") return data;
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.message === "string") return data.message;

  // Pydantic validation errors come as { detail: [{loc, msg, type}, ...] }
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    const first = data.detail[0];
    if (first?.msg) return first.msg;
  }

  return fallback;
};