"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, ShieldCheck } from "@phosphor-icons/react";

import { resetPassword } from "@/src/adapters/auth/password-reset-actions";
import { PasswordField } from "./password-field";

type ResetAction = (input: { token: string; password: string; confirmPassword: string }) => Promise<{ ok: boolean; message: string }>;

export function ResetPasswordForm({
  token,
  action = resetPassword,
  onSuccess,
}: {
  token: string;
  action?: ResetAction;
  onSuccess?: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string }>();
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const strength = password.length === 0 ? 0 : 1 + Number(password.length >= 8) + Number(/[A-Za-z]/.test(password) && /\d/.test(password)) + Number(/[A-Z]/.test(password) && /[a-z]/.test(password) && /[^A-Za-z0-9]/.test(password));

  useEffect(() => {
    if (result?.ok) successHeadingRef.current?.focus();
  }, [result]);

  if (result?.ok) {
    return (
      <section className="flex flex-col items-center text-center" role="status">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]">
          <CheckCircle aria-hidden="true" size={36} weight="fill" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#001040]" ref={successHeadingRef} tabIndex={-1}>Kata sandi berhasil diperbarui</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#53647A]">
          Akses akun Anda telah dipulihkan. Gunakan kata sandi baru untuk masuk kembali ke CocokIn.
        </p>
        <div className="my-6 flex w-full items-start gap-3 rounded-xl border border-[#D8E1EE] bg-[#F8FAFC] p-4 text-left">
          <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-[#006FE6]" size={20} />
          <p className="m-0 text-xs leading-relaxed text-[#53647A]">
            Tautan reset ini sudah tidak dapat digunakan kembali. Seluruh sesi lama juga telah dibatalkan untuk menjaga keamanan akun.
          </p>
        </div>
        <Link className="auth-submit inline-flex items-center gap-2" href="/login">
          Masuk ke akun <ArrowRight aria-hidden="true" size={17} weight="bold" />
        </Link>
      </section>
    );
  }

  return (
    <form
      className="auth-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        const nextResult = await action({ token, password, confirmPassword: confirmation });
        setResult(nextResult);
        if (nextResult.ok) onSuccess?.();
        setPending(false);
      }}
    >
      {result ? <div className={result.ok ? "auth-success" : "auth-alert"} role="status"><p>{result.message}</p></div> : null}
      <header className="mb-2">
        <h1 className="text-2xl font-black tracking-tight text-[#001040]">Buat kata sandi baru</h1>
        <p className="mt-1 text-sm text-[#53647A]">Gunakan kata sandi unik dengan minimal delapan karakter.</p>
      </header>
      <>
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
      </>
    </form>
  );
}
