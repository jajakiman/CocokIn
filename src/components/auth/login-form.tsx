"use client";

import { GoogleLogo, WarningCircle, CheckCircle, XCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { unavailableAuthAdapter } from "@/src/auth-ui/adapter";
import { loginSchema } from "@/src/auth-ui/schemas";
import type { AuthResult, AuthUiAdapter } from "@/src/auth-ui/types";

import { PasswordField } from "./password-field";

type LoginField = "email" | "password";
type LoginErrors = Partial<Record<LoginField, string>>;

function validationErrors(form: HTMLFormElement): LoginErrors {
  const data = new FormData(form);
  const result = loginSchema.safeParse({
    email: data.get("email"),
    password: data.get("password"),
  });

  if (result.success) return {};

  return Object.fromEntries(
    result.error.issues.map((issue) => [issue.path[0], issue.message]),
  );
}

export function LoginForm({ adapter }: { adapter: AuthUiAdapter }) {
  const [errors, setErrors] = useState<LoginErrors>({});
  const [failure, setFailure] = useState<string>();
  const [pendingAction, setPendingAction] = useState<"credentials" | "google">();
  const [invalidAttempt, setInvalidAttempt] = useState(0);
  const [modalState, setModalState] = useState<{ ok: boolean; message: string; destination?: string } | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const isPending = pendingAction !== undefined;

  useEffect(() => {
    if (invalidAttempt > 0) summaryRef.current?.focus();
  }, [invalidAttempt]);

  async function applyResult(result: AuthResult) {
    if (!result.ok) {
      setFailure(result.message);
      setModalState({ ok: false, message: result.message });
    } else {
      let destination = "/";
      if (result.user.role === "BUSINESS") destination = "/business";
      else if (result.user.role === "TALENT") destination = "/talent";
      else if (result.user.role === "ADMIN") destination = "/admin";

      setModalState({
        ok: true,
        message: `Selamat datang kembali, ${result.user.displayName}! Mengalihkan ke ruang kerja...`,
        destination,
      });

      setTimeout(() => {
        window.location.assign(destination);
      }, 1200);
    }
  }

  async function submitCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validationErrors(event.currentTarget);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setInvalidAttempt((attempt) => attempt + 1);
      return;
    }

    const data = new FormData(event.currentTarget);
    setPendingAction("credentials");
    try {
      await applyResult(
        await adapter.loginWithCredentials({
          email: String(data.get("email")),
          password: String(data.get("password")),
        }),
      );
    } finally {
      setPendingAction(undefined);
    }
  }

  async function submitGoogle() {
    setPendingAction("google");
    try {
      await applyResult(await adapter.loginWithGoogle());
    } finally {
      setPendingAction(undefined);
    }
  }

  const errorEntries = Object.entries(errors) as [LoginField, string][];

  return (
    <>
      <form className="auth-form" noValidate onSubmit={submitCredentials}>
        {failure ? (
          <div className="auth-alert" role="alert">
            <WarningCircle aria-hidden="true" size={20} />
            <p>{failure}</p>
          </div>
        ) : null}
        {errorEntries.length > 0 ? (
          <div
            aria-label="Periksa kembali formulir"
            className="auth-error-summary"
            ref={summaryRef}
            role="alert"
            tabIndex={-1}
          >
            <strong>Periksa kembali formulir</strong>
            <ul>
              {errorEntries.map(([field, message]) => (
                <li key={field}><a href={`#login-${field}`}>{message}</a></li>
              ))}
            </ul>
          </div>
        ) : null}
        <button
          className="auth-google-button"
          disabled={isPending}
          onClick={submitGoogle}
          type="button"
        >
          <GoogleLogo aria-hidden="true" size={20} weight="bold" />
          {pendingAction === "google" ? "Menghubungkan Google..." : "Masuk dengan Google"}
        </button>
        <div className="auth-divider"><span>atau gunakan email</span></div>
        <div className="auth-field">
          <label htmlFor="login-email">Email</label>
          <input
            aria-describedby={errors.email ? "login-email-error" : undefined}
            aria-invalid={errors.email ? true : undefined}
            autoComplete="email"
            disabled={isPending}
            id="login-email"
            name="email"
            type="email"
          />
          {errors.email ? <p className="auth-field__error" id="login-email-error">{errors.email}</p> : null}
        </div>
        <PasswordField
          autoComplete="current-password"
          disabled={isPending}
          error={errors.password}
          id="login-password"
          label="Kata sandi"
          name="password"
        />
        <div className="auth-form__aside-link">
          <Link href="/forgot-password">Lupa kata sandi?</Link>
        </div>
        <button className="auth-submit" disabled={isPending} type="submit">
          {pendingAction === "credentials" ? "Memproses..." : "Masuk"}
        </button>
        <p className="auth-form__switch">Belum punya akun? <Link href="/register">Daftar sekarang</Link></p>
      </form>

      {/* Interactive Modal Alert */}
      <AnimatePresence>
        {modalState && (
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
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center border border-[#D8E1EE]"
            >
              {modalState.ok ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", damping: 12, stiffness: 200 }}
                  className="w-20 h-20 bg-[#ECFDF5] text-[#059669] rounded-full flex items-center justify-center mb-5 shadow-inner"
                >
                  <CheckCircle size={48} weight="fill" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", damping: 12, stiffness: 200 }}
                  className="w-20 h-20 bg-[#FFF1F2] text-[#E11D48] rounded-full flex items-center justify-center mb-5 shadow-inner"
                >
                  <XCircle size={48} weight="fill" />
                </motion.div>
              )}

              <h2 className="text-2xl font-bold text-[#001040] mb-2">
                {modalState.ok ? "Berhasil Masuk!" : "Gagal Masuk"}
              </h2>
              <p className="text-[#53647A] text-sm mb-6 whitespace-pre-line leading-relaxed" data-testid="auth-modal-message">
                {modalState.message}
              </p>

              {modalState.ok ? (
                <div className="w-full bg-[#EAF3FF] py-2.5 px-4 rounded-xl text-xs font-bold text-[#006FE6] flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#006FE6] animate-ping" />
                  Mengalihkan otomatis...
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setModalState(null)}
                  className="w-full bg-[#001040] text-white font-bold py-3 rounded-xl hover:bg-[#001040]/90 transition-colors"
                >
                  Coba Lagi
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function UnavailableLoginForm() {
  return <LoginForm adapter={unavailableAuthAdapter} />;
}
