import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loading?: boolean;
}

export default function CustomButton({ label, loading, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`rounded-xl px-5 py-2 font-semibold transition-all 
                 bg-red-500 text-white hover:bg-red-600 active:scale-95
                 disabled:opacity-60 disabled:cursor-not-allowed
                 ${props.className}`}
    >
      {loading ? "Please wait..." : label}
    </button>
  );
}
