import { useState } from "react";
import {
  FileText,
  Download,
  Share2,
  Trash2,
  Lock,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { fileService } from "../services/fileService.js";
import {
  formatFileSize,
  formatDate,
  getFileTypeLabel,
} from "../utils/formatters.js";
import { isPreviewable } from "../utils/previewHelpers.js";
import PasswordModal from "./PasswordModal.jsx";
import PreviewModal from "./PreviewModal.jsx";
import ConfirmModal from "./ConfirmModal.jsx";

const FileCard = ({ file, onDelete, onShare, isShared = false }) => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canPreview = isPreviewable(file.mimeType);

  const handleDownload = async (password) => {
    setDownloading(true);
    try {
      const response = await fileService.downloadFile(file._id, password);

      const blob = new Blob([response.data], { type: file.mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded: ${file.originalName}`);
      setShowDownloadModal(false);
    } catch (error) {
      let message = "Download failed";
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const parsed = JSON.parse(text);
          message = parsed.message || message;
        } catch {
          // Ignore parse errors
        }
      } else {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fileService.deleteFile(file._id);
      toast.success("File deleted");
      setShowDeleteModal(false);
      onDelete?.(file._id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="relative bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-5 hover:border-blue-500/40 hover:bg-slate-900/90 transition-all duration-200 group shadow-lg shadow-black/10 hover:shadow-blue-500/5">
        <div className="flex items-start gap-4">
          {/* File icon */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500/90 border-2 border-slate-900 flex items-center justify-center shadow-md">
              <Lock className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-white font-semibold truncate"
              title={file.originalName}
            >
              {file.originalName}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 flex-wrap">
              <span className="px-2 py-0.5 bg-slate-800/80 border border-slate-700/60 rounded-md font-medium">
                {getFileTypeLabel(file.mimeType)}
              </span>
              <span className="font-medium">{formatFileSize(file.originalSize)}</span>
              <span className="text-slate-600">•</span>
              <span>{formatDate(file.createdAt)}</span>
            </div>
            {isShared && file.owner && (
              <p className="text-xs text-slate-500 mt-1.5">
                Shared by{" "}
                <span className="text-slate-300 font-medium">
                  {file.owner.name}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800">
          {canPreview && (
            <button
              onClick={() => setShowPreviewModal(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-lg transition"
              title="Preview file"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          )}

          <button
            onClick={() => setShowDownloadModal(true)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-lg transition"
          >
            <Download className="w-4 h-4" />
            Download
          </button>

          {!isShared && (
            <>
              <button
                onClick={() => onShare?.(file)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-lg transition"
                title="Share file"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-200 text-sm rounded-lg transition disabled:opacity-50"
                title="Delete file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <PasswordModal
        isOpen={showDownloadModal}
        onClose={() => !downloading && setShowDownloadModal(false)}
        onSubmit={handleDownload}
        title="Decrypt and download"
        description={`Enter your password to decrypt "${file.originalName}".`}
        actionLabel="Download"
        loading={downloading}
      />

      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        file={file}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete file?"
        description={`"${file.originalName}" will be permanently deleted from your vault. This action cannot be undone.`}
        confirmLabel="Delete file"
        cancelLabel="Cancel"
        variant="danger"
        icon={Trash2}
        loading={deleting}
      />
    </>
  );
};

export default FileCard;