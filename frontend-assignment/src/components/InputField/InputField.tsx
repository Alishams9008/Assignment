import React, { useId, forwardRef, useState } from "react";

export type InputVariant = "filled" | "outlined" | "ghost";
export type InputSize = "sm" | "md" | "lg";

export interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean; // extra, matches "loading state" requirement
  variant?: InputVariant;
  size?: InputSize;
  type?: React.HTMLInputTypeAttribute; // allow "password" etc.
  allowClear?: boolean; // optional feature
  allowPasswordToggle?: boolean; // optional feature
  id?: string; // to support external control
}

const sizeClasses: Record<InputSize, string> = {
  sm: "h-9 text-sm px-3",
  md: "h-10 text-base px-3.5",
  lg: "h-12 text-base px-4",
};

const variantClasses: Record<InputVariant, string> = {
  filled:
    "bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-gray-300",
  outlined:
    "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700",
  ghost:
    "bg-transparent border border-transparent focus:border-gray-300 dark:focus:border-gray-700",
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder,
      helperText,
      errorMessage,
      disabled,
      invalid,
      loading,
      variant = "outlined",
      size = "md",
      type = "text",
      allowClear,
      allowPasswordToggle,
      id,
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? `input-${autoId}`;
    const describedById = `${inputId}-desc`;
    const [showPassword, setShowPassword] = useState(false);

    const base =
      "w-full rounded-xl outline-none transition focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600";
    const state =
      disabled
        ? "opacity-60 cursor-not-allowed"
        : invalid
        ? "border-red-500 focus:ring-red-300 dark:focus:ring-red-600"
        : "";
    const spinner = (
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-5 w-5 border-2 border-gray-300 border-t-transparent rounded-full"
      />
    );

    const isPassword = type === "password";
    const effectiveType = isPassword && allowPasswordToggle && showPassword ? "text" : type;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={helperText || errorMessage ? describedById : undefined}
            type={effectiveType}
            className={[
              base,
              sizeClasses[size],
              variantClasses[variant],
              invalid ? "border-red-500" : "",
              loading ? "pr-10" : "pr-9",
            ].join(" ")}
          />

          {/* Clear button */}
          {allowClear && value && !loading && !disabled && (
            <button
              type="button"
              aria-label="Clear input"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                const e = { target: { value: "" } } as unknown as React.ChangeEvent<HTMLInputElement>;
                onChange?.(e);
              }}
            >
              ×
            </button>
          )}

          {/* Password toggle */}
          {isPassword && allowPasswordToggle && !loading && (
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          )}

          {/* Loading spinner */}
          {loading && (
            <span role="status" aria-live="polite" className="absolute inset-y-0 right-2 flex items-center">
              {spinner}
            </span>
          )}
        </div>

        {(helperText || (invalid && errorMessage)) && (
          <p
            id={describedById}
            className={[
              "mt-1 text-xs",
              invalid ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400",
            ].join(" ")}
            aria-live="polite"
          >
            {invalid && errorMessage ? errorMessage : helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
