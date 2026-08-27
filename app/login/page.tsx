import type { Metadata } from "next";

import { AuthShell } from "@/src/components/auth/auth-shell";
import { UnavailableLoginForm } from "@/src/components/auth/login-form";

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
      <UnavailableLoginForm />
    </AuthShell>
  );
}
