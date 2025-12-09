import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: any;
  loading?: boolean;
}

export default function CustomButton({ label, loading, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`cursor-pointer transition-all 
                 active:scale-95
                 disabled:opacity-60 disabled:cursor-not-allowed
                 ${props.className}`}
    >
      {loading ? "Please wait..." : label}
    </button>
  );
}
