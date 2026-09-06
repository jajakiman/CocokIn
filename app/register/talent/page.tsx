import type { Metadata } from "next";

import { AuthShell } from "@/src/components/auth/auth-shell";
import { RegistrationForm } from "@/src/components/auth/registration-form";
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
  title: "Daftar sebagai Talent",
  description: "Buat akun Talent CocokIn untuk mengukur kesiapan karier dan membangun bukti kerja terverifikasi.",
};

export default function TalentRegistrationPage() {
  return (
    <AuthShell
      title="Daftar sebagai Talent"
      description="Buat akun untuk memulai perjalanan kesiapan karier Anda."
      contextTitle="Ubah potensi menjadi bukti"
      context={<p>Ukur kesiapan, pahami skill gap, dan terapkan kemampuan melalui micro-project yang relevan.</p>}
    >
      <RegistrationForm adapter={serverAdapter} role="TALENT" />
    </AuthShell>
  );
}
