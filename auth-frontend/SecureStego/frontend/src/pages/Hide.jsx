import { useState } from "react";
import { Lock, EyeOff, Loader2, AlertCircle, Shield, Info, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { stegoService } from "../services/stegoService.js";
import { getErrorMessage } from "../utils/errors.js";
import ImageDropzone from "../components/ImageDropzone.jsx";
import HideResult from "../components/HideResult.jsx";

const Hide = () => {
  const [coverFile, setCoverFile] = useState(null);
  const [secretFile, setSecretFile] = useState(null);
  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [isHiding, setIsHiding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const canSubmit =
    coverFile &&
    secretFile &&
    passphrase.length >= 4 &&
    passphrase === confirmPassphrase &&
    !isHiding;

  const handleHide = async (e) => {
    e.preventDefault();

    if (passphrase !== confirmPassphrase) {
      toast.error("Passphrases do not match");
      return;
    }
    if (passphrase.length < 4) {
      toast.error("Passphrase must be at least 4 characters");
      return;
    }

    setIsHiding(true);
    setProgress(0);

    try {
      const response = await stegoService.hideImage({
        coverFile,
        secretFile,
        passphrase,
        onProgress: setProgress,
      });
      setResult({ ...response, coverFile });
      toast.success("Secret hidden successfully!");
    } catch (error) {
      let message = "Hide operation failed";
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
      setIsHiding(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setCoverFile(null);
    setSecretFile(null);
    setPassphrase("");
    setConfirmPassphrase("");
    setResult(null);
  };

  if (result) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Hide complete</h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            Your secret is now hidden inside the cover image.
          </p>
        </div>
        <HideResult result={result} coverFile={result.coverFile} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
          <EyeOff className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Hide an image</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            AES-256 encrypt a secret image and embed it invisibly inside a cover image.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left — form */}
        <form onSubmit={handleHide} className="lg:col-span-3 space-y-5">
          {/* Image dropzones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageDropzone
              label="Cover image"
              helperText="The visible image (e.g., a photo)"
              file={coverFile}
              onFileSelect={setCoverFile}
              accent="violet"
              disabled={isHiding}
            />
            <ImageDropzone
              label="Secret image"
              helperText="The image to hide inside the cover"
              file={secretFile}
              onFileSelect={setSecretFile}
              accent="indigo"
              disabled={isHiding}
            />
          </div>

          {/* Sizing hint */}
          {coverFile && secretFile && (
            <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-500/8 border border-amber-500/20 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
              <p className="text-amber-200/80 text-sm">
                The cover image should be significantly larger than the secret. If the cover is too small, the operation will fail with a capacity error.
              </p>
            </div>
          )}

          {/* Passphrase fields */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Encryption passphrase</h3>
                <p className="text-xs text-slate-500">Required to decrypt the secret later. Store it safely.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Passphrase</label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  disabled={isHiding}
                  required
                  minLength={4}
                  placeholder="At least 4 characters"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm passphrase</label>
                <input
                  type="password"
                  value={confirmPassphrase}
                  onChange={(e) => setConfirmPassphrase(e.target.value)}
                  disabled={isHiding}
                  required
                  placeholder="Re-enter passphrase"
                  className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm ${
                    confirmPassphrase && confirmPassphrase !== passphrase
                      ? "border-red-500/50"
                      : "border-slate-700"
                  }`}
                />
                {confirmPassphrase && confirmPassphrase !== passphrase && (
                  <p className="text-xs text-red-400 mt-1.5">Passphrases do not match</p>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {isHiding && progress > 0 && (
            <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-violet-500 to-indigo-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 text-sm"
          >
            {isHiding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {progress > 0 && progress < 100 ? `Uploading... ${progress}%` : "Encrypting and embedding..."}
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                Hide secret in cover image
              </>
            )}
          </button>
        </form>

        {/* Right — info sidebar */}
        <div className="lg:col-span-2 space-y-4">
          {/* How it works */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-white">How it works</h3>
            </div>
            <ol className="space-y-3">
              {[
                { step: "01", title: "Choose images", desc: "Select a cover image (visible) and the secret image you want to hide inside it." },
                { step: "02", title: "Set a passphrase", desc: "Derives an AES-256 key via PBKDF2 key stretching with a random salt." },
                { step: "03", title: "Encrypt & embed", desc: "The secret is AES-256 encrypted, then embedded into the cover's least-significant bits." },
                { step: "04", title: "Download stego", desc: "The output PNG is visually identical to the cover. No one can extract the secret without your passphrase." },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-3">
                  <span className="text-xs font-mono font-bold text-violet-500 mt-0.5 shrink-0">{item.step}</span>
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
              <Shield className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Security details</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Encryption", value: "AES-256-CBC" },
                { label: "Key derivation", value: "PBKDF2-SHA256" },
                { label: "Embedding", value: "LSB steganography" },
                { label: "Output format", value: "PNG (lossless)" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="text-slate-200 font-semibold font-mono bg-slate-800 px-2 py-0.5 rounded">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2.5 p-4 bg-indigo-500/8 border border-indigo-500/15 rounded-xl">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-slate-200 font-semibold">Cover size matters.</span> The cover image must have enough pixels to hold the encrypted payload. As a rule of thumb, the cover should be at least 4× larger than the secret in pixel count.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hide;
