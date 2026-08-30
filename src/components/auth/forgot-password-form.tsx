"use client";

import { WarningCircle, EnvelopeSimple, ClockCountdown } from "@phosphor-icons/react";
import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { unavailableAuthAdapter } from "@/src/auth-ui/adapter";
import { forgotPasswordSchema } from "@/src/auth-ui/schemas";
import type { AuthUiAdapter } from "@/src/auth-ui/types";

export function ForgotPasswordForm({ adapter }: { adapter: AuthUiAdapter }) {
  const [error, setError] = useState<string>();
  const [failure, setFailure] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isPending, setIsPending] = useState(false);
  const [invalidAttempt, setInvalidAttempt] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (invalidAttempt > 0) summaryRef.current?.focus();
  }, [invalidAttempt]);

  // Countdown timer when modal is open
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showModal && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showModal, cooldown]);

  async function handleSendReset(emailToSend: string) {
    setIsPending(true);
    try {
      const resetResult = await adapter.requestPasswordReset(emailToSend);
      if (!resetResult.ok) {
        setFailure(resetResult.message);
      } else {
        setSuccess(resetResult.message);
        setSubmittedEmail(emailToSend);
        setCooldown(60);
        setShowModal(true);
      }
    } finally {
      setIsPending(false);
    }
  }

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
    await handleSendReset(result.data.email);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <form className="auth-form" noValidate onSubmit={submit}>
        {failure ? (
          <div className="auth-alert" role="alert">
            <WarningCircle aria-hidden="true" size={20} />
            <p>{failure}</p>
          </div>
        ) : null}
        {success ? (
          <div className="auth-success" role="status">
            <p>{success}</p>
          </div>
        ) : null}
        {error ? (
          <div aria-label="Periksa kembali formulir" className="auth-error-summary" ref={summaryRef} role="alert" tabIndex={-1}>
            <strong>Periksa kembali formulir</strong>
            <ul>
              <li><a href="#forgot-email">Email: {error}</a></li>
            </ul>
          </div>
        ) : null}
        <div className="auth-field">
          <label htmlFor="forgot-email">Email</label>
          <input
            aria-describedby={error ? "forgot-email-error" : undefined}
            aria-invalid={error ? true : undefined}
            autoComplete="email"
            disabled={isPending}
            id="forgot-email"
            name="email"
            type="email"
          />
          {error ? <p className="auth-field__error" id="forgot-email-error">{error}</p> : null}
        </div>
        <button className="auth-submit" disabled={isPending} type="submit">
          {isPending ? "Memproses..." : "Kirim instruksi reset"}
        </button>
        <p className="auth-form__switch">
          <Link href="/login">Kembali ke halaman masuk</Link>
        </p>
      </form>

      {/* Interactive Modal with Cooldown Timer */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center border border-[#D8E1EE]"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", damping: 12, stiffness: 200 }}
                className="w-20 h-20 bg-[#ECFDF5] text-[#059669] rounded-full flex items-center justify-center mb-5 shadow-inner"
              >
                <EnvelopeSimple size={44} weight="duotone" />
              </motion.div>

              <h2 className="text-2xl font-bold text-[#001040] mb-2">
                Instruksi Reset Terkirim!
              </h2>
              <p className="text-[#53647A] text-sm mb-6 leading-relaxed">
                Tautan untuk mengatur ulang kata sandi telah dikirimkan ke <strong>{submittedEmail}</strong>. Silakan periksa kotak masuk atau folder spam email Anda.
              </p>

              {/* Cooldown Info Box */}
              <div className="w-full bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl p-4 mb-6 text-left space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#53647A]">
                  <span className="flex items-center gap-1.5 text-[#001040]">
                    <ClockCountdown size={16} className="text-[#006FE6]" /> Waktu tunggu kirim ulang:
                  </span>
                  <span className="font-mono text-[#006FE6] text-sm">
                    {formatTime(cooldown)}
                  </span>
                </div>
                <p className="text-[11px] text-[#53647A]">
                  Beri jeda beberapa menit agar server email dapat mengirimkan instruksi dengan aman.
                </p>
              </div>

              <div className="space-y-3 w-full">
                <button
                  type="button"
                  disabled={cooldown > 0 || isPending}
                  onClick={() => handleSendReset(submittedEmail)}
                  className="w-full bg-[#001040] text-white font-bold py-3 rounded-xl hover:bg-[#001040]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  {cooldown > 0 ? `Tunggu (${formatTime(cooldown)}) untuk kirim ulang` : "Kirim Ulang Email Reset"}
                </button>
                <Link
                  href="/login"
                  className="block w-full bg-[#F1F5FB] text-[#001040] font-bold py-3 rounded-xl hover:bg-[#E2E8F0] transition-colors text-sm text-center"
                >
                  Kembali ke Halaman Masuk
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function UnavailableForgotPasswordForm() {
  return <ForgotPasswordForm adapter={unavailableAuthAdapter} />;
}
