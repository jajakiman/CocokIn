import type { Metadata } from "next";

import { AuthShell } from "@/src/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/src/components/auth/forgot-password-form";
import * as serverActions from "@/src/adapters/auth/server-adapter";
import type { AuthUiAdapter } from "@/src/auth-ui/types";

const serverAdapter: AuthUiAdapter = {
  loginWithCredentials: serverActions.loginWithCredentials,
  loginWithGoogle: serverActions.loginWithGoogle,
  register: serverActions.register,
  requestPasswordReset: serverActions.requestPasswordReset,
  logout: serverActions.logout,
};

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
      <ForgotPasswordForm adapter={serverAdapter} />
    </AuthShell>
  );
}
