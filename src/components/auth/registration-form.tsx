"use client";

import { WarningCircle, CheckCircle, XCircle, GoogleLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { unavailableAuthAdapter } from "@/src/auth-ui/adapter";
import { registrationSchema, toRegistrationRequest } from "@/src/auth-ui/schemas";
import type { AuthUiAdapter, PublicRegistrationRole } from "@/src/auth-ui/types";

import { PasswordField } from "./password-field";

type RegistrationField =
  | "fullName"
  | "email"
  | "password"
  | "confirmPassword"
  | "termsAccepted";
type RegistrationErrors = Partial<Record<RegistrationField, string>>;

export function RegistrationForm({
  role,
  adapter,
}: {
  role: PublicRegistrationRole;
  adapter: AuthUiAdapter;
}) {
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [failure, setFailure] = useState<string>();
  const [isPending, setIsPending] = useState(false);
  const [pendingGoogle, setPendingGoogle] = useState(false);
  const [invalidAttempt, setInvalidAttempt] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalState, setModalState] = useState<{ ok: boolean; message: string; destination?: string } | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const roleLabel = role === "TALENT" ? "Talent" : "UMKM";
  const passwordStrength = password.length === 0
    ? 0
    : 1 + Number(password.length >= 8) + Number(/[A-Za-z]/.test(password) && /\d/.test(password)) + Number(/[A-Z]/.test(password) && /[a-z]/.test(password) && /[^A-Za-z0-9]/.test(password));
  const strengthLabel = ["", "Lemah", "Cukup", "Bagus", "Kuat"][passwordStrength];
  const hasInvalidPasswordFeedback = Boolean(password || confirmPassword) && (password.length < 8 || password !== confirmPassword);

  useEffect(() => {
    if (invalidAttempt > 0) summaryRef.current?.focus();
  }, [invalidAttempt]);

  async function submitGoogle() {
    setPendingGoogle(true);
    try {
      const result = await adapter.loginWithGoogle(role);
      if (result && !result.ok) {
        setFailure(result.message);
      }
    } finally {
      setPendingGoogle(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = registrationSchema.safeParse({
      role,
      fullName: data.get("fullName"),
      email: data.get("email"),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
      termsAccepted: data.has("termsAccepted"),
    });

    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])));
      setInvalidAttempt((attempt) => attempt + 1);
      return;
    }

    setErrors({});
    setIsPending(true);
    try {
      const authResult = await adapter.register(toRegistrationRequest(result.data));
      if (!authResult.ok) {
        setFailure(authResult.message);
        setModalState({ ok: false, message: authResult.message });
      } else {
        const destination = "/verify-email";
        setModalState({
          ok: true,
          message: `Akun ${roleLabel} ${authResult.user.displayName} berhasil dibuat. Verifikasi alamat email Anda untuk melanjutkan.`,
          destination,
        });

        setTimeout(() => {
          window.location.assign(destination);
        }, 1400);
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <form className="auth-form" noValidate onSubmit={submit}>
        {failure ? (
          <div className="auth-alert" role="alert">
            <WarningCircle aria-hidden="true" size={18} />
            <p className="text-xs font-medium">{failure}</p>
          </div>
        ) : null}

        <button
          className="auth-google-button"
          disabled={isPending || pendingGoogle}
          onClick={submitGoogle}
          type="button"
        >
          <GoogleLogo aria-hidden="true" size={20} weight="bold" />
          {pendingGoogle ? "Menghubungkan Google..." : `Daftar sebagai ${roleLabel} dengan Google`}
        </button>

        <div className="auth-divider"><span>atau gunakan email</span></div>

        <div className="auth-field">
          <label htmlFor="register-fullName">Nama lengkap <span className="text-[#E11D48]" aria-hidden="true">*</span></label>
          <input
            aria-describedby={errors.fullName ? "register-fullName-error" : undefined}
            aria-invalid={errors.fullName ? true : undefined}
            autoComplete="name"
            disabled={isPending}
            id="register-fullName"
            name="fullName"
            type="text"
            onChange={() => {
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
            }}
          />
          {errors.fullName ? <p className="auth-field__error text-xs text-[#E11D48] font-medium mt-1" id="register-fullName-error">{errors.fullName}</p> : null}
        </div>
        <div className="auth-field">
          <label htmlFor="register-email">Email <span className="text-[#E11D48]" aria-hidden="true">*</span></label>
          <input
            aria-describedby={errors.email ? "register-email-error" : undefined}
            aria-invalid={errors.email ? true : undefined}
            autoComplete="email"
            disabled={isPending}
            id="register-email"
            name="email"
            type="email"
            onChange={() => {
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />
          {errors.email ? <p className="auth-field__error text-xs text-[#E11D48] font-medium mt-1" id="register-email-error">{errors.email}</p> : null}
        </div>
        <PasswordField
          autoComplete="new-password"
          disabled={isPending}
          error={errors.password}
          helper="Minimal 8 karakter."
          id="register-password"
          label="Kata sandi"
          name="password"
          required
          onChange={(event) => {
            setPassword(event.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          statusId="register-password-strength"
          value={password}
        />
        <div className="auth-password-strength" id="register-password-strength" aria-label="Kekuatan kata sandi" aria-valuemax={4} aria-valuemin={0} aria-valuenow={passwordStrength} aria-valuetext={strengthLabel || "Belum diisi"} role="progressbar">
          {password ? <>
            <div className="auth-password-strength__track" aria-hidden="true">
              {Array.from({ length: 4 }, (_, index) => <span data-active={index < passwordStrength} data-strength={passwordStrength} key={index} />)}
            </div>
            <p aria-live="polite"><strong>{strengthLabel}</strong><span>Gunakan huruf besar, angka, dan simbol agar lebih kuat.</span></p>
          </> : null}
        </div>
        <PasswordField
          autoComplete="new-password"
          disabled={isPending}
          error={errors.confirmPassword}
          id="register-confirmPassword"
          invalid={Boolean(confirmPassword) && password !== confirmPassword}
          label="Konfirmasi kata sandi"
          name="confirmPassword"
          required
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          statusId="register-confirmPassword-status"
          value={confirmPassword}
        />
        <p className="auth-password-match text-xs font-medium" data-match={Boolean(confirmPassword) && password === confirmPassword} id="register-confirmPassword-status" aria-live="polite">
          {confirmPassword ? (password === confirmPassword ? "Kata sandi cocok" : "Kata sandi belum cocok") : ""}
        </p>
        <div className="auth-consents">
          <div className="auth-checkbox-field">
            <input
              aria-describedby={errors.termsAccepted ? "register-termsAccepted-error" : undefined}
              aria-invalid={errors.termsAccepted ? true : undefined}
              disabled={isPending}
              id="register-termsAccepted"
              name="termsAccepted"
              required
              type="checkbox"
              onChange={() => {
                if (errors.termsAccepted) setErrors((prev) => ({ ...prev, termsAccepted: undefined }));
              }}
            />
            <div>
              <label htmlFor="register-termsAccepted" className="font-normal leading-relaxed">
                Saya telah membaca dan menyetujui{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#006FE6] font-bold underline underline-offset-4 decoration-[#006FE6] hover:text-[#005DCC] hover:decoration-[#005DCC] transition-colors"
                  style={{ textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "#006FE6" }}
                >
                  Syarat dan Ketentuan Layanan
                </Link>{" "}
                serta{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#006FE6] font-bold underline underline-offset-4 decoration-[#006FE6] hover:text-[#005DCC] hover:decoration-[#005DCC] transition-colors"
                  style={{ textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "#006FE6" }}
                >
                  Kebijakan Privasi
                </Link>{" "}
                CocokIn. <span className="text-[#E11D48]" aria-hidden="true">*</span>
              </label>
              {errors.termsAccepted ? <p className="auth-field__error text-xs text-[#E11D48] font-medium mt-1" id="register-termsAccepted-error">{errors.termsAccepted}</p> : null}
            </div>
          </div>
        </div>
        <button className="auth-submit" disabled={isPending || hasInvalidPasswordFeedback} type="submit">{isPending ? "Mendaftarkan..." : `Daftar sebagai ${roleLabel}`}</button>
        <p className="auth-form__switch">Sudah punya akun? <Link href="/login">Masuk</Link></p>
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
                {modalState.ok ? "Pendaftaran Berhasil!" : "Pendaftaran Gagal"}
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

export function UnavailableRegistrationForm({ role }: { role: PublicRegistrationRole }) {
  return <RegistrationForm adapter={unavailableAuthAdapter} role={role} />;
}
