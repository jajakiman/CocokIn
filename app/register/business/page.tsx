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
  title: "Daftar sebagai UMKM",
  description: "Buat akun UMKM CocokIn untuk mendiagnosis kebutuhan dan menjalankan proyek digital terukur.",
};

export default function BusinessRegistrationPage() {
  return (
    <AuthShell
      title="Daftar sebagai UMKM"
      description="Buat akun untuk memulai perjalanan digital usaha Anda."
      contextTitle="Selesaikan kebutuhan digital dengan lebih pasti"
      context={<p>Terjemahkan masalah bisnis menjadi proyek yang terarah, temukan Talent yang sesuai, dan tinjau hasilnya.</p>}
    >
      <RegistrationForm adapter={serverAdapter} role="BUSINESS" />
    </AuthShell>
  );
}
