"use client";

import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useId, useState } from "react";

type PasswordFieldProps = {
  id?: string;
  name: string;
  label: string;
  autoComplete: "current-password" | "new-password";
  helper?: string;
  error?: string;
  disabled?: boolean;
};

export function PasswordField({
  id,
  name,
  label,
  autoComplete,
  helper,
  error,
  disabled = false,
}: PasswordFieldProps) {
  const generatedId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const inputId = id ?? `${name}-${generatedId}`;
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="auth-field">
      <label htmlFor={inputId}>{label}</label>
      <div className="auth-password">
        <input
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          autoComplete={autoComplete}
          disabled={disabled}
          id={inputId}
          name={name}
          type={isVisible ? "text" : "password"}
        />
        <button
          aria-label={isVisible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          className="auth-password__toggle"
          data-testid="password-toggle"
          disabled={disabled}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsVisible(!isVisible);
          }}
          type="button"
        >
          {isVisible ? <EyeSlash aria-hidden="true" size={20} /> : <Eye aria-hidden="true" size={20} />}
        </button>
      </div>
      {helper ? <p className="auth-field__helper" id={helperId}>{helper}</p> : null}
      {error ? <p className="auth-field__error" id={errorId}>{error}</p> : null}
    </div>
  );
}
