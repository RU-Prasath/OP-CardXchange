import { useState } from "react";
import { Lock, Eye, Loader2, Info, Shield, FileSearch } from "lucide-react";
import toast from "react-hot-toast";
import { stegoService } from "../services/stegoService.js";
import { getErrorMessage } from "../utils/errors.js";
import ImageDropzone from "../components/ImageDropzone.jsx";
import RevealResult from "../components/RevealResult.jsx";

const Reveal = () => {
  const [stegoFile, setStegoFile] = useState(null);
  const [passphrase, setPassphrase] = useState("");
  const [isRevealing, setIsRevealing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const canSubmit = stegoFile && passphrase.trim().length > 0 && !isRevealing;

  const handleReveal = async (e) => {
    e.preventDefault();

    if (!passphrase.trim()) {
      toast.error("Passphrase is required");
      return;
    }

    setIsRevealing(true);
    setProgress(0);

    try {
      const response = await stegoService.revealImage({
        stegoFile,
        passphrase,
        onProgress: setProgress,
      });
      setResult({ ...response, stegoFile });
      toast.success("Secret revealed successfully!");
    } catch (error) {
      let message = "Reveal operation failed";
      const data = error?.response?.data;
      if (data instanceof Blob) {
        try {
          const text = await data.text();
          const parsed = JSON.parse(text);
          message = parsed.detail || parsed.message || message;
        } catch {
          // Fall through
        }
      } else {
        message = getErrorMessage(error, message);
      }
      toast.error(message);
    } finally {
      setIsRevealing(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setStegoFile(null);
    setPassphrase("");
    setResult(null);
  };

  if (result) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Reveal complete</h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            The hidden image has been successfully extracted and decrypted.
          </p>
        </div>
        <RevealResult result={result} stegoFile={result.stegoFile} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-600 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
          <Eye className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reveal an image</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Extract and decrypt a hidden image from a stego image using your passphrase.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left — form */}
        <form onSubmit={handleReveal} className="lg:col-span-3 space-y-5">
          {/* Stego image dropzone */}
          <ImageDropzone
            label="Stego image"
            helperText="The image containing the hidden secret (PNG format)"
            file={stegoFile}
            onFileSelect={setStegoFile}
            accent="cyan"
            disabled={isRevealing}
          />

          {/* Info note */}
          <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-500/8 border border-blue-500/20 rounded-xl">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
            <div>
              <p className="text-sm font-semibold text-blue-100 mb-0.5">Use a PNG file produced by SecureStego</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                JPEG and other lossy formats destroy the hidden data. The stego image must be the exact PNG saved from a previous hide operation.
              </p>
            </div>
          </div>

          {/* Passphrase field */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Decryption passphrase</h3>
                <p className="text-xs text-slate-500">The same passphrase used during the hide operation</p>
              </div>
            </div>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              disabled={isRevealing}
              required
              placeholder="Enter the passphrase"
              autoFocus
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Progress bar */}
          {isRevealing && progress > 0 && (
            <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-cyan-500 to-teal-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 text-sm"
          >
            {isRevealing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {progress > 0 && progress < 100 ? `Uploading... ${progress}%` : "Extracting and decrypting..."}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Reveal hidden secret
              </>
            )}
          </button>
        </form>

        {/* Right — info sidebar */}
        <div className="lg:col-span-2 space-y-4">
          {/* Decryption process */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileSearch className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Decryption process</h3>
            </div>
            <ol className="space-y-3">
              {[
                { step: "01", title: "Read LSB bits", desc: "The least-significant bits of each pixel are extracted to reconstruct the embedded payload." },
                { step: "02", title: "Verify header", desc: "The payload's magic header is checked to confirm it's a valid SecureStego image." },
                { step: "03", title: "Derive key", desc: "An AES-256 key is derived from your passphrase using PBKDF2-SHA256 with the stored salt." },
                { step: "04", title: "Decrypt & rebuild", desc: "The payload is decrypted with AES-256-CBC and reconstructed into the original image." },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-3">
                  <span className="text-xs font-mono font-bold text-cyan-500 mt-0.5 shrink-0">{item.step}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Security info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-semibold text-white">Verification</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Decryption", value: "AES-256-CBC" },
                { label: "Key derivation", value: "PBKDF2-SHA256" },
                { label: "Integrity", value: "Magic header check" },
                { label: "Hash", value: "SHA-256" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="text-slate-200 font-semibold font-mono bg-slate-800 px-2 py-0.5 rounded">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2.5 p-4 bg-cyan-500/8 border border-cyan-500/15 rounded-xl">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-slate-200 font-semibold">Wrong passphrase?</span> The operation will fail or produce a corrupted image. Make sure to use exactly the same passphrase that was used during the hide operation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reveal;
