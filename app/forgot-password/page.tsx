import type { Metadata } from "next";

import { AuthShell } from "@/src/components/auth/auth-shell";
import { UnavailableForgotPasswordForm } from "@/src/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi",
  description: "Minta instruksi untuk mengatur ulang kata sandi akun CocokIn.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Atur ulang kata sandi"
      description="Masukkan email akun Anda untuk meminta instruksi reset."
      contextTitle="Kembali ke akun Anda dengan aman"
      context={<p>Layanan hanya akan menyatakan instruksi terkirim setelah penyedia autentikasi berhasil memproses permintaan.</p>}
    >
      <UnavailableForgotPasswordForm />
    </AuthShell>
  );
}
