import { useState, useEffect } from "react";
import {
  Download,
  RotateCcw,
  Hash,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { shortHash } from "../utils/formatters.js";

const RevealResult = ({ result, stegoFile, onReset }) => {
  const [secretUrl, setSecretUrl] = useState(null);
  const [stegoUrl, setStegoUrl] = useState(null);

  useEffect(() => {
    if (!result?.secretBlob || !stegoFile) return;

    const sUrl = URL.createObjectURL(result.secretBlob);
    const stUrl = URL.createObjectURL(stegoFile);
    setSecretUrl(sUrl);
    setStegoUrl(stUrl);

    return () => {
      URL.revokeObjectURL(sUrl);
      URL.revokeObjectURL(stUrl);
    };
  }, [result, stegoFile]);

  const handleDownload = () => {
    if (!secretUrl) return;
    const link = document.createElement("a");
    link.href = secretUrl;
    link.download = `secret-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Secret image downloaded");
  };

  const metadata = result?.metadata;

  return (
    <div className="space-y-5">
      {/* Success banner */}
      <div className="flex items-center gap-3 p-4 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Secret revealed successfully</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            The hidden image has been decrypted and recovered from the stego image.
          </p>
        </div>
      </div>

      {/* Side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-300">Stego image</h4>
            <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-800 rounded-full">Input</span>
          </div>
          {stegoUrl && (
            <img src={stegoUrl} alt="Stego" className="w-full h-56 object-contain bg-slate-950 rounded-xl" />
          )}
          <p className="text-xs text-slate-500 mt-2 text-center">Carrier (contained the hidden secret)</p>
        </div>

        <div className="bg-slate-900 border border-cyan-500/25 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-white">Recovered secret</h4>
            <span className="text-xs text-cyan-400 font-medium px-2 py-0.5 bg-cyan-500/10 rounded-full border border-cyan-500/15">Decrypted</span>
          </div>
          {secretUrl && (
            <img src={secretUrl} alt="Recovered secret" className="w-full h-56 object-contain bg-slate-950 rounded-xl" />
          )}
          {metadata?.secret_size && (
            <p className="text-xs text-slate-500 mt-2 text-center">
              {metadata.secret_size.width} × {metadata.secret_size.height}
            </p>
          )}
        </div>
      </div>

      {/* Metadata card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Decryption details</h3>
            <p className="text-xs text-slate-500">Cryptographic verification of the recovered image</p>
          </div>
        </div>

        <div className="space-y-2.5 pt-3 border-t border-slate-800">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              Secret dimensions
            </span>
            <span className="text-white font-semibold">
              {metadata?.secret_size ? `${metadata.secret_size.width} × ${metadata.secret_size.height}` : "—"}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" />
              SHA-256 hash
            </span>
            <span className="text-white font-mono text-xs" title={metadata?.secret_hash}>
              {metadata?.secret_hash ? shortHash(metadata.secret_hash) : "—"}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Integrity check</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Passed
            </span>
          </div>
        </div>

        <p className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
          The recovered image was successfully decrypted using AES-256-CBC, and the magic header confirmed it was a valid SecureStego payload.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 text-sm"
        >
          <Download className="w-4 h-4" />
          Download recovered secret
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold rounded-xl text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reveal another
        </button>
      </div>
    </div>
  );
};

export default RevealResult;
