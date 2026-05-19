import { useState, useRef } from "react";
import { Upload, Loader2, FileUp } from "lucide-react";
import toast from "react-hot-toast";
import { fileService } from "../services/fileService.js";
import { formatFileSize } from "../utils/formatters.js";

const FileUpload = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    // 50MB limit (matches backend)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File is too large. Max size is 50 MB.");
      return;
    }

    setCurrentFile(file);
    setUploading(true);
    setProgress(0);

    try {
      await fileService.uploadFile(file, (percent) => {
        setProgress(percent);
      });
      toast.success("File encrypted and uploaded successfully!");
      onUploadSuccess?.();
    } catch (error) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
      setCurrentFile(null);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!uploading) inputRef.current?.click();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      className={`
        relative border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-200 overflow-hidden
        ${
          isDragging
            ? "border-blue-500 bg-blue-500/10 scale-[1.01] shadow-xl shadow-blue-500/10"
            : "border-slate-700/80 hover:border-blue-500/50 bg-slate-900/60 backdrop-blur-sm hover:bg-slate-900/80"
        }
        ${uploading ? "cursor-not-allowed" : ""}
      `}
    >
      {/* Subtle gradient overlay on hover */}
      {!uploading && (
        <div
          className={`pointer-events-none absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-indigo-500/5 transition-opacity ${
            isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
        disabled={uploading}
      />

      {uploading ? (
        <div className="relative text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
          <div>
            <p className="text-white font-semibold">Encrypting & uploading</p>
            <p className="text-sm text-slate-400 mt-1 truncate max-w-md mx-auto">
              {currentFile?.name} ({formatFileSize(currentFile?.size || 0)})
            </p>
          </div>
          <div className="w-full max-w-sm mx-auto bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-200 shadow-lg shadow-blue-500/30"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 font-mono">{progress}%</p>
        </div>
      ) : (
        <div className="relative text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl shadow-lg shadow-blue-500/10">
            <FileUp className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-base">
              Drop a file here or click to upload
            </p>
            <p className="text-sm text-slate-400 mt-1.5">
              Files are encrypted on your device before upload
              <span className="hidden sm:inline"> • Max 50 MB</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;