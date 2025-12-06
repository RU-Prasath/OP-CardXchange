import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  labelClassName?: string;
  label?: string;
  error?: string;
}

export default function CustomInput({ labelClassName, label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className={`font-medium text-sm ${labelClassName}`}>{label}</label>}
    
      <input
        {...props}
        className={`border rounded-lg px-3 py-2 w-full outline-none 
                     transition 
                    ${props.className}`}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
