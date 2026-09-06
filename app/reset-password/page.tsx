import type { Metadata } from "next";

import { AuthShell } from "@/src/components/auth/auth-shell";
import { ResetPasswordShell } from "@/src/components/auth/reset-password-shell";

export const metadata: Metadata = { title: "Reset Kata Sandi", description: "Buat kata sandi baru akun CocokIn." };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token;
  return token ? (
    <ResetPasswordShell token={token} />
  ) : (
    <AuthShell title="Tautan reset tidak valid" description="Token reset tidak tersedia." contextTitle="Pulihkan akses dengan aman" context={<p>Minta tautan reset baru dari halaman lupa kata sandi.</p>}>
      <div className="auth-alert" role="alert"><p>Token reset tidak tersedia.</p></div>
    </AuthShell>
  );
}
