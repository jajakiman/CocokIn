"use client";

import { ClockCountdown, EnvelopeSimple, WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";

import { unavailableAuthAdapter } from "@/src/auth-ui/adapter";
import { forgotPasswordSchema } from "@/src/auth-ui/schemas";
import type { AuthUiAdapter } from "@/src/auth-ui/types";

export function ForgotPasswordForm({ adapter }: { adapter: AuthUiAdapter }) {
  const [error, setError] = useState<string>();
  const [failure, setFailure] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cooldown > 0) return;

    const data = new FormData(event.currentTarget);
    const result = forgotPasswordSchema.safeParse({ email: data.get("email") });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }

    setError(undefined);
    setFailure(undefined);
    setIsPending(true);
    try {
      const resetResult = await adapter.requestPasswordReset(result.data.email);
      if (!resetResult.ok) {
        setFailure(resetResult.message);
        return;
      }
      setSubmittedEmail(result.data.email);
      setSuccess(resetResult.message);
      setCooldown(60);
    } finally {
      setIsPending(false);
    }
  }

  const countdown = `${Math.floor(cooldown / 60).toString().padStart(2, "0")}:${(cooldown % 60).toString().padStart(2, "0")}`;

  return (
    <form className="auth-form" noValidate onSubmit={submit}>
      {failure ? (
        <div className="auth-alert" role="alert">
          <WarningCircle aria-hidden="true" size={18} />
          <p className="text-xs font-medium">{failure}</p>
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4 text-[#047857]" role="status">
          <div className="flex items-start gap-3">
            <EnvelopeSimple aria-hidden="true" className="mt-0.5 shrink-0" size={20} weight="duotone" />
            <div className="min-w-0 space-y-1">
              <strong className="block text-sm">Permintaan reset diterima</strong>
              <p className="text-xs leading-relaxed">
                {success} Jika akun ditemukan, email akan diproses. Periksa kotak masuk dan folder spam untuk <span className="font-bold">{submittedEmail}</span> dalam beberapa menit.
              </p>
              {cooldown > 0 ? (
                <p className="flex items-center gap-1.5 pt-1 text-xs font-semibold">
                  <ClockCountdown aria-hidden="true" size={15} /> Kirim ulang tersedia dalam {countdown}
                </p>
              ) : (
                <p className="pt-1 text-xs font-semibold">Anda dapat mengirim ulang instruksi sekarang.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="auth-field">
        <label htmlFor="forgot-email">Email <span aria-hidden="true" className="text-[#E11D48]">*</span></label>
        <input
          aria-describedby={error ? "forgot-email-error" : undefined}
          aria-invalid={error ? true : undefined}
          autoComplete="email"
          defaultValue={submittedEmail}
          disabled={isPending}
          id="forgot-email"
          name="email"
          onChange={() => {
            if (error) setError(undefined);
          }}
          type="email"
        />
        {error ? <p className="auth-field__error text-xs font-medium" id="forgot-email-error">{error}</p> : null}
      </div>

      <button className="auth-submit" disabled={isPending || cooldown > 0} type="submit">
        {isPending
          ? "Memproses..."
          : cooldown > 0
            ? `Tunggu ${countdown}`
            : success
              ? "Kirim ulang instruksi"
              : "Kirim instruksi reset"}
      </button>
      <p className="auth-form__switch"><Link href="/login">Kembali ke halaman masuk</Link></p>
    </form>
  );
}

export function UnavailableForgotPasswordForm() {
  return <ForgotPasswordForm adapter={unavailableAuthAdapter} />;
}
