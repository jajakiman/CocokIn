"use client";

import { useState } from "react";
import Link from "next/link";

import { resetPassword } from "@/src/adapters/auth/password-reset-actions";
import { PasswordField } from "./password-field";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string }>();
  const strength = password.length === 0 ? 0 : 1 + Number(password.length >= 8) + Number(/[A-Za-z]/.test(password) && /\d/.test(password)) + Number(/[A-Z]/.test(password) && /[a-z]/.test(password) && /[^A-Za-z0-9]/.test(password));

  return (
    <form
      className="auth-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setResult(await resetPassword({ token, password, confirmPassword: confirmation }));
        setPending(false);
      }}
    >
      {result ? <div className={result.ok ? "auth-success" : "auth-alert"} role="status"><p>{result.message}</p></div> : null}
      {!result?.ok ? <>
        <PasswordField autoComplete="new-password" helper="Minimal 8 karakter." label="Kata sandi baru" name="password" onChange={(event) => setPassword(event.target.value)} value={password} />
        <div aria-label="Kekuatan kata sandi" aria-valuemax={4} aria-valuemin={0} aria-valuenow={strength} className="auth-password-strength" role="progressbar">
          <div className="auth-password-strength__track" aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => <span data-active={index < strength} data-strength={strength} key={index} />)}
          </div>
        </div>
        <PasswordField autoComplete="new-password" invalid={Boolean(confirmation) && password !== confirmation} label="Konfirmasi kata sandi baru" name="confirmPassword" onChange={(event) => setConfirmation(event.target.value)} value={confirmation} />
        <button className="auth-submit" disabled={pending || password.length < 8 || password !== confirmation} type="submit">
          {pending ? "Memperbarui..." : "Perbarui kata sandi"}
        </button>
      </> : <Link className="auth-submit" href="/login">Kembali ke halaman masuk</Link>}
    </form>
  );
}
