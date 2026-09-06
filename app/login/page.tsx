import type { Metadata } from "next";

import { AuthShell } from "@/src/components/auth/auth-shell";
import { LoginForm } from "@/src/components/auth/login-form";
import * as serverActions from "@/src/adapters/auth/server-adapter";
import type { AuthUiAdapter } from "@/src/auth-ui/types";

const serverAdapter: AuthUiAdapter = {
  loginWithCredentials: serverActions.loginWithCredentials,
  loginWithGoogle: serverActions.loginWithGoogle,
  register: serverActions.register,
  requestPasswordReset: serverActions.requestPasswordReset,
  logout: serverActions.logout
};

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke CocokIn dengan Google atau email dan kata sandi.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Masuk ke CocokIn"
      description="Gunakan akun Anda untuk melanjutkan ke ruang kerja CocokIn."
      contextTitle="Satu ruang untuk bertumbuh dan menyelesaikan kebutuhan digital"
      context={<p>Talent membangun bukti kerja terverifikasi. UMKM menjalankan proyek digital dengan hasil yang dapat ditinjau.</p>}
    >
      <LoginForm adapter={serverAdapter} />
    </AuthShell>
  );
}
