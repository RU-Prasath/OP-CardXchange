import { useState, useEffect } from "react";
import {
  Share2,
  X,
  Mail,
  Lock,
  Loader2,
  Users,
  Trash2,
  UserPlus,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import { fileService } from "../services/fileService.js";
import { formatDate } from "../utils/formatters.js";
import ConfirmModal from "./ConfirmModal.jsx";

const ShareModal = ({ isOpen, onClose, file }) => {
  const [activeTab, setActiveTab] = useState("new");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sharing, setSharing] = useState(false);
  const [shares, setShares] = useState([]);
  const [loadingShares, setLoadingShares] = useState(false);
  const [revoking, setRevoking] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setRecipientEmail("");
      setPassword("");
      setActiveTab("new");
      setShares([]);
    } else if (file) {
      fetchShares();
    }
  }, [isOpen, file]);

  const fetchShares = async () => {
    if (!file) return;
    setLoadingShares(true);
    try {
      const { shares } = await fileService.getFileShares(file._id);
      setShares(shares);
    } catch (error) {
      toast.error("Failed to load shares list");
    } finally {
      setLoadingShares(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!recipientEmail.trim() || !password.trim()) return;

    setSharing(true);
    try {
      await fileService.shareFile(file._id, password, recipientEmail.trim());
      toast.success(`Shared with ${recipientEmail}`);
      setRecipientEmail("");
      setPassword("");
      // Refresh shares list and switch to it
      await fetchShares();
      setActiveTab("manage");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sharing failed");
    } finally {
      setSharing(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    const { userId, userName } = revokeTarget;

    setRevoking(userId);
    try {
      await fileService.revokeShare(file._id, userId);
      toast.success(`Access revoked for ${userName}`);
      setShares((prev) => prev.filter((s) => s._id !== userId));
      setRevokeTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Revoke failed");
    } finally {
      setRevoking(null);
    }
  };

  if (!isOpen || !file) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={() => !sharing && onClose()}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white">Share file</h2>
              <p
                className="text-xs text-slate-400 truncate"
                title={file.originalName}
              >
                {file.originalName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={sharing}
            className="text-slate-400 hover:text-white disabled:opacity-50 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b border-slate-800">
          <button
            onClick={() => setActiveTab("new")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === "new"
                ? "border-blue-500 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            New share
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === "manage"
                ? "border-blue-500 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            Manage access
            {shares.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-slate-700 rounded">
                {shares.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "new" ? (
            <form onSubmit={handleShare} className="space-y-4">
              <p className="text-sm text-slate-400">
                Share this file with another SecureVault user. The file's
                encryption key will be securely re-wrapped using their public
                key.
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Recipient email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    required
                    disabled={sharing}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="user@example.com"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  The user must have a SecureVault account.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={sharing}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="Required to unwrap the encryption key"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={sharing}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sharing || !recipientEmail.trim() || !password.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sharing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Share
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {loadingShares ? (
                <div className="text-center py-8 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                  Loading shares...
                </div>
              ) : shares.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">
                    This file is not shared with anyone yet.
                  </p>
                  <button
                    onClick={() => setActiveTab("new")}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-400 font-medium"
                  >
                    Share it now
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {shares.map((share) => (
                    <div
                      key={share._id}
                      className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                          <span className="text-blue-500 font-medium text-sm">
                            {share.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {share.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {share.email}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Shared {formatDate(share.sharedAt)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setRevokeTarget({
                            userId: share._id,
                            userName: share.name,
                          })
                        }
                        disabled={revoking === share._id}
                        className="shrink-0 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
                        title="Revoke access"
                      >
                        {revoking === share._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!revokeTarget}
        onClose={() => !revoking && setRevokeTarget(null)}
        onConfirm={handleRevoke}
        title="Revoke access?"
        description={
          revokeTarget
            ? `${revokeTarget.userName} will no longer be able to access this file. You can share it again later.`
            : ""
        }
        confirmLabel="Revoke access"
        cancelLabel="Cancel"
        variant="warning"
        icon={ShieldAlert}
        loading={!!revoking}
      />
    </div>
  );
};

export default ShareModal;