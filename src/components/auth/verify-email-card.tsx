"use client";

import { EnvelopeSimple, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { resendVerificationEmail } from "@/src/adapters/auth/email-verification-actions";

export function VerifyEmailCard({ email, invalid }: { email?: string; invalid: boolean }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string>();

  return (
    <div className="auth-form">
      <div className="rounded-xl border border-[#D8E1EE] bg-white p-5 text-center">
        <EnvelopeSimple className="mx-auto mb-3 text-[#006FE6]" size={34} weight="duotone" />
        <strong className="block text-base text-[#001040]">Periksa email Anda</strong>
        <p className="mt-2 text-sm leading-relaxed text-[#53647A]">
          Kami mengirim tautan verifikasi ke {email ? <span className="font-bold text-[#001040]">{email}</span> : "alamat email pendaftaran Anda"}. Tautan berlaku selama 24 jam.
        </p>
      </div>
      {invalid ? (
        <div className="auth-alert" role="alert"><WarningCircle size={18} /><p className="text-xs font-medium">Tautan verifikasi tidak valid atau sudah kedaluwarsa.</p></div>
      ) : null}
      {message ? <div className="auth-success" role="status"><p className="text-xs font-medium">{message}</p></div> : null}
      <button
        className="auth-submit"
        disabled={pending || !email}
        onClick={async () => {
          setPending(true);
          const result = await resendVerificationEmail();
          setMessage(result.message);
          setPending(false);
        }}
        type="button"
      >
        {pending ? "Mengirim..." : "Kirim ulang email verifikasi"}
      </button>
    </div>
  );
}
