"use client";

import { WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";

import { unavailableAuthAdapter } from "@/src/auth-ui/adapter";
import { forgotPasswordSchema } from "@/src/auth-ui/schemas";
import type { AuthUiAdapter } from "@/src/auth-ui/types";

export function ForgotPasswordForm({ adapter }: { adapter: AuthUiAdapter }) {
  const [error, setError] = useState<string>();
  const [failure, setFailure] = useState<string>();
  const [isPending, setIsPending] = useState(false);
  const [invalidAttempt, setInvalidAttempt] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (invalidAttempt > 0) summaryRef.current?.focus();
  }, [invalidAttempt]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = forgotPasswordSchema.safeParse({ email: data.get("email") });

    if (!result.success) {
      setError(result.error.issues[0]?.message);
      setInvalidAttempt((attempt) => attempt + 1);
      return;
    }

    setError(undefined);
    setIsPending(true);
    try {
      const resetResult = await adapter.requestPasswordReset(result.data.email);
      if (!resetResult.ok) setFailure(resetResult.message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="auth-form" noValidate onSubmit={submit}>
      {failure ? (
        <div className="auth-alert" role="alert"><WarningCircle aria-hidden="true" size={20} /><p>{failure}</p></div>
      ) : null}
      {error ? (
        <div aria-label="Periksa kembali formulir" className="auth-error-summary" ref={summaryRef} role="alert" tabIndex={-1}>
          <strong>Periksa kembali formulir</strong>
          <ul><li><a href="#forgot-email">Email: {error}</a></li></ul>
        </div>
      ) : null}
      <div className="auth-field">
        <label htmlFor="forgot-email">Email</label>
        <input aria-describedby={error ? "forgot-email-error" : undefined} aria-invalid={error ? true : undefined} autoComplete="email" disabled={isPending} id="forgot-email" name="email" type="email" />
        {error ? <p className="auth-field__error" id="forgot-email-error">{error}</p> : null}
      </div>
      <button className="auth-submit" disabled={isPending} type="submit">{isPending ? "Memproses..." : "Kirim instruksi reset"}</button>
      <p className="auth-form__switch"><Link href="/login">Kembali ke halaman masuk</Link></p>
    </form>
  );
}

export function UnavailableForgotPasswordForm() {
  return <ForgotPasswordForm adapter={unavailableAuthAdapter} />;
}
