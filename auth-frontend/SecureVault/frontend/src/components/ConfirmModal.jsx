import { AlertTriangle, X, Loader2 } from "lucide-react";

const VARIANTS = {
  danger: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    button:
      "bg-red-600 hover:bg-red-700 focus:ring-red-500/40 disabled:bg-red-700/50",
  },
  warning: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    button:
      "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500/40 disabled:bg-amber-700/50",
  },
  primary: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    button:
      "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/40 disabled:bg-blue-700/50",
  },
};

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  icon: Icon = AlertTriangle,
  loading = false,
}) => {
  if (!isOpen) return null;

  const styles = VARIANTS[variant] || VARIANTS.danger;

  const handleConfirm = () => {
    if (!loading) onConfirm?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={() => !loading && onClose?.()}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${styles.iconBg}`}
            >
              <Icon className={`w-5 h-5 ${styles.iconColor}`} />
            </div>
            <div className="pt-0.5">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-500 hover:text-white transition disabled:opacity-50 shrink-0 -mt-1 -mr-1 p-1 rounded-md hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-3 p-6 pt-2 bg-slate-900/40 border-t border-slate-800 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white font-medium rounded-lg transition focus:outline-none focus:ring-2 ${styles.button}`}
            autoFocus
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Please wait...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
