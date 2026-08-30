"use client";

import { Eye, EyeSlash } from "@phosphor-icons/react";
import { type ChangeEventHandler, useId, useState } from "react";

type PasswordFieldProps = {
  id?: string;
  name: string;
  label: string;
  autoComplete: "current-password" | "new-password";
  helper?: string;
  error?: string;
  disabled?: boolean;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  statusId?: string;
  invalid?: boolean;
};

export function PasswordField({
  id,
  name,
  label,
  autoComplete,
  helper,
  error,
  disabled = false,
  value,
  onChange,
  statusId,
  invalid,
}: PasswordFieldProps) {
  const generatedId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const inputId = id ?? `${name}-${generatedId}`;
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helperId, errorId, statusId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="auth-field">
      <label htmlFor={inputId}>{label}</label>
      <div className="auth-password">
        <input
          aria-describedby={describedBy}
          aria-invalid={error || invalid ? true : undefined}
          autoComplete={autoComplete}
          disabled={disabled}
          id={inputId}
          name={name}
          onChange={onChange}
          type={isVisible ? "text" : "password"}
          value={value}
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
