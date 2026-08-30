"use client";

import { WarningCircle, CheckCircle, XCircle } from "@phosphor-icons/react";
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
  | "termsAccepted"
  | "privacyAccepted";
type RegistrationErrors = Partial<Record<RegistrationField, string>>;

const fieldLabels: Record<RegistrationField, string> = {
  fullName: "Nama lengkap",
  email: "Email",
  password: "Kata sandi",
  confirmPassword: "Konfirmasi kata sandi",
  termsAccepted: "Syarat dan Ketentuan",
  privacyAccepted: "Pemrosesan data pribadi",
};

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
      privacyAccepted: data.has("privacyAccepted"),
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
        const destination = authResult.user.role === "BUSINESS" ? "/business/profile" : "/talent/profile";
        setModalState({
          ok: true,
          message: `Selamat datang di CocokIn, ${authResult.user.displayName}! Akun ${roleLabel} Anda berhasil dibuat. Mengalihkan ke langkah selanjutnya...`,
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

  const errorEntries = Object.entries(errors) as [RegistrationField, string][];

  return (
    <>
      <form className="auth-form" noValidate onSubmit={submit}>
        {failure ? (
          <div className="auth-alert" role="alert">
            <WarningCircle aria-hidden="true" size={20} />
            <p>{failure}</p>
          </div>
        ) : null}
        {errorEntries.length > 0 ? (
          <div aria-label="Periksa kembali formulir" className="auth-error-summary" ref={summaryRef} role="alert" tabIndex={-1}>
            <strong>Periksa kembali formulir</strong>
            <ul>
              {errorEntries.map(([field, message]) => (
                <li key={field}><a href={`#register-${field}`}>{fieldLabels[field]}: {message}</a></li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="auth-field">
          <label htmlFor="register-fullName">Nama lengkap</label>
          <input aria-describedby={errors.fullName ? "register-fullName-error" : undefined} aria-invalid={errors.fullName ? true : undefined} autoComplete="name" disabled={isPending} id="register-fullName" name="fullName" type="text" />
          {errors.fullName ? <p className="auth-field__error" id="register-fullName-error">{errors.fullName}</p> : null}
        </div>
        <div className="auth-field">
          <label htmlFor="register-email">Email</label>
          <input aria-describedby={errors.email ? "register-email-error" : undefined} aria-invalid={errors.email ? true : undefined} autoComplete="email" disabled={isPending} id="register-email" name="email" type="email" />
          {errors.email ? <p className="auth-field__error" id="register-email-error">{errors.email}</p> : null}
        </div>
        <PasswordField autoComplete="new-password" disabled={isPending} error={errors.password} helper="Minimal 8 karakter." id="register-password" label="Kata sandi" name="password" onChange={(event) => setPassword(event.target.value)} statusId="register-password-strength" value={password} />
        <div className="auth-password-strength" id="register-password-strength" aria-label="Kekuatan kata sandi" aria-valuemax={4} aria-valuemin={0} aria-valuenow={passwordStrength} aria-valuetext={strengthLabel || "Belum diisi"} role="progressbar">
          {password ? <>
            <div className="auth-password-strength__track" aria-hidden="true">
              {Array.from({ length: 4 }, (_, index) => <span data-active={index < passwordStrength} data-strength={passwordStrength} key={index} />)}
            </div>
            <p aria-live="polite"><strong>{strengthLabel}</strong><span>Gunakan huruf besar, angka, dan simbol agar lebih kuat.</span></p>
          </> : null}
        </div>
        <PasswordField autoComplete="new-password" disabled={isPending} error={errors.confirmPassword} id="register-confirmPassword" invalid={Boolean(confirmPassword) && password !== confirmPassword} label="Konfirmasi kata sandi" name="confirmPassword" onChange={(event) => setConfirmPassword(event.target.value)} statusId="register-confirmPassword-status" value={confirmPassword} />
        <p className="auth-password-match" data-match={Boolean(confirmPassword) && password === confirmPassword} id="register-confirmPassword-status" aria-live="polite">
          {confirmPassword ? (password === confirmPassword ? "Kata sandi cocok" : "Kata sandi belum cocok") : ""}
        </p>
        <div className="auth-consents">
          <div className="auth-checkbox-field">
            <input aria-describedby={errors.termsAccepted ? "register-termsAccepted-error" : undefined} aria-invalid={errors.termsAccepted ? true : undefined} disabled={isPending} id="register-termsAccepted" name="termsAccepted" required type="checkbox" />
            <div>
              <label htmlFor="register-termsAccepted">Saya menyetujui Syarat dan Ketentuan.</label>
              {errors.termsAccepted ? <p className="auth-field__error" id="register-termsAccepted-error">{errors.termsAccepted}</p> : null}
            </div>
          </div>
          <div className="auth-checkbox-field">
            <input aria-describedby={errors.privacyAccepted ? "register-privacyAccepted-error" : undefined} aria-invalid={errors.privacyAccepted ? true : undefined} disabled={isPending} id="register-privacyAccepted" name="privacyAccepted" required type="checkbox" />
            <div>
              <label htmlFor="register-privacyAccepted">Saya menyetujui pemrosesan data pribadi untuk pembuatan akun.</label>
              {errors.privacyAccepted ? <p className="auth-field__error" id="register-privacyAccepted-error">{errors.privacyAccepted}</p> : null}
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
