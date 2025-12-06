import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
  options: string[];
}

export default function CustomSelect({
  label,
  labelClassName,
  error,
  options,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className={`font-medium text-sm ${labelClassName}`}>
          {label}
        </label>
      )}

      <select
        {...props}
        className={`border rounded-lg px-3 py-2 w-full outline-none transition ${props.className}`}
      >
        <option value="">Select Category</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
