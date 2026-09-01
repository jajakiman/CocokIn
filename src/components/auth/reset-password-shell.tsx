"use client";

import { useState } from "react";

import { AuthShell } from "./auth-shell";
import { ResetPasswordForm } from "./reset-password-form";

export function ResetPasswordShell({ token }: { token: string }) {
  const [complete, setComplete] = useState(false);
  return (
    <AuthShell
      context={<p>{complete ? "Kata sandi baru Anda telah aktif dan sesi lama sudah dibatalkan." : "Link reset berlaku satu jam dan hanya dapat digunakan sekali."}</p>}
      contextTitle={complete ? "Akun Anda kembali aman" : "Pulihkan akses dengan aman"}
      description=""
      hideHeading
      title=""
    >
      <ResetPasswordForm onSuccess={() => setComplete(true)} token={token} />
    </AuthShell>
  );
}
