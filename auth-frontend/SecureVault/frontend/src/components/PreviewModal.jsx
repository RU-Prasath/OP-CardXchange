import { useState, useEffect } from "react";
import {
  X,
  Lock,
  Loader2,
  Download,
  AlertCircle,
  FileQuestion,
} from "lucide-react";
import toast from "react-hot-toast";
import { fileService } from "../services/fileService.js";
import { formatFileSize } from "../utils/formatters.js";
import { getPreviewType, isPreviewable } from "../utils/previewHelpers.js";

const PreviewModal = ({ isOpen, onClose, file }) => {
  const [step, setStep] = useState("password"); // 'password' | 'loading' | 'preview' | 'error'
  const [password, setPassword] = useState("");
  const [blobUrl, setBlobUrl] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [error, setError] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Clean up blob URL to prevent memory leak
      if (blobUrl) {
        window.URL.revokeObjectURL(blobUrl);
      }
      setStep("password");
      setPassword("");
      setBlobUrl(null);
      setTextContent("");
      setError("");
    }
  }, [isOpen]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrl) {
        window.URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const handleDecrypt = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setStep("loading");
    setError("");

    try {
      const response = await fileService.previewFile(file._id, password);
      const blob = new Blob([response.data], { type: file.mimeType });
      const previewType = getPreviewType(file.mimeType);

      // For text files, read the content directly
      if (previewType === "text") {
        const text = await blob.text();
        setTextContent(text);
      } else {
        const url = window.URL.createObjectURL(blob);
        setBlobUrl(url);
      }

      setStep("preview");
    } catch (err) {
      let message = "Failed to decrypt file";
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          message = parsed.message || message;
        } catch {
          // Ignore parse errors
        }
      } else {
        message = err.response?.data?.message || message;
      }
      setError(message);
      setStep("password");
      toast.error(message);
    }
  };

  const handleDownload = async () => {
    if (!blobUrl && !textContent) return;

    try {
      let downloadUrl = blobUrl;
      // If it was a text file, create a fresh blob URL for download
      if (!downloadUrl && textContent) {
        const blob = new Blob([textContent], { type: file.mimeType });
        downloadUrl = window.URL.createObjectURL(blob);
      }

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the temporary URL if we created one
      if (!blobUrl && downloadUrl) {
        setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 100);
      }

      toast.success(`Downloaded: ${file.originalName}`);
    } catch (err) {
      toast.error("Download failed");
    }
  };

  if (!isOpen || !file) return null;

  const previewType = getPreviewType(file.mimeType);
  const canPreview = isPreviewable(file.mimeType);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <h2
                className="text-base font-semibold text-white truncate"
                title={file.originalName}
              >
                {file.originalName}
              </h2>
              <p className="text-xs text-slate-400">
                {file.mimeType} · {formatFileSize(file.originalSize)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {step === "preview" && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto">
          {/* Password step */}
          {step === "password" && (
            <div className="p-8">
              {!canPreview ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-2xl mb-4">
                    <FileQuestion className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Preview not supported
                  </h3>
                  <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                    This file type ({file.mimeType}) can't be previewed in the
                    browser. You can still download it to view it locally.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleDecrypt}
                  className="max-w-sm mx-auto space-y-4"
                >
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/10 rounded-2xl mb-3">
                      <Lock className="w-7 h-7 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white">
                      Decrypt to preview
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Enter your password to decrypt this file.
                    </p>
                  </div>

                  {error && (
                    <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your password"
                  />

                  <button
                    type="submit"
                    disabled={!password.trim()}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition"
                  >
                    Decrypt and preview
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Loading step */}
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
              <p className="text-white font-medium">Decrypting...</p>
              <p className="text-sm text-slate-400 mt-1">
                AES-GCM + RSA-2048 decryption in progress
              </p>
            </div>
          )}

          {/* Preview step */}
          {step === "preview" && (
            <div className="p-4">
              {previewType === "image" && (
                <div className="flex items-center justify-center">
                  <img
                    src={blobUrl}
                    alt={file.originalName}
                    className="max-w-full max-h-[70vh] rounded-lg"
                  />
                </div>
              )}

              {previewType === "pdf" && (
                <iframe
                  src={blobUrl}
                  title={file.originalName}
                  className="w-full h-[70vh] rounded-lg bg-white"
                />
              )}

              {previewType === "video" && (
                <video
                  src={blobUrl}
                  controls
                  className="w-full max-h-[70vh] rounded-lg"
                >
                  Your browser does not support video playback.
                </video>
              )}

              {previewType === "audio" && (
                <div className="py-12 px-6 text-center">
                  <p className="text-white mb-4">{file.originalName}</p>
                  <audio src={blobUrl} controls className="w-full">
                    Your browser does not support audio playback.
                  </audio>
                </div>
              )}

              {previewType === "text" && (
                <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-200 overflow-auto max-h-[70vh] whitespace-pre-wrap wrap-break-word font-mono">
                  {textContent}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;