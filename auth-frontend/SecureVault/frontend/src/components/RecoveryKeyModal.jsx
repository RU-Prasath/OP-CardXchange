import { useState } from "react";
import { Shield, Copy, Check, Download, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const RecoveryKeyModal = ({ recoveryKey, userEmail, onContinue }) => {
  const [copied, setCopied] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryKey);
      setCopied(true);
      toast.success("Recovery key copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = () => {
    const content = `SecureVault Recovery Key
========================

Account: ${userEmail}
Generated: ${new Date().toLocaleString()}

RECOVERY KEY:
${recoveryKey}

IMPORTANT:
- Store this key in a safe place (password manager, printed copy, secure note)
- This is the ONLY way to recover your account if you forget your password
- SecureVault cannot recover your account without this key
- Do NOT share this key with anyone

Without this key AND your password, your files are permanently inaccessible.
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `securevault-recovery-key-${userEmail}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Recovery key file downloaded");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Save your recovery key
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            This is the only way to recover your account if you forget your
            password.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Warning box */}
          <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-100">
              <p className="font-medium mb-1">This will only be shown once</p>
              <p className="text-amber-200/80">
                We don't store this key anywhere readable. If you lose both your
                password and this key, your files will be permanently
                inaccessible.
              </p>
            </div>
          </div>

          {/* Recovery key display */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your recovery key
            </label>
            <div className="bg-slate-800 border-2 border-blue-500/30 rounded-lg p-4 font-mono text-center">
              <p className="text-white text-lg tracking-wider break-all select-all">
                {recoveryKey}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          {/* Where to store tips */}
          <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400 space-y-1">
            <p className="font-medium text-slate-300 mb-1.5">
              Where to store it safely:
            </p>
            <p>• Password manager (recommended)</p>
            <p>• Printed copy in a secure location</p>
            <p>• Encrypted note in a trusted app</p>
          </div>

          {/* Acknowledgment */}
          <label className="flex items-start gap-3 p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-300">
              I have saved my recovery key in a safe place. I understand
              SecureVault cannot recover my account without it.
            </span>
          </label>

          <button
            onClick={onContinue}
            disabled={!acknowledged}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
          >
            Continue to dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecoveryKeyModal;