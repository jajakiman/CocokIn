import type { Metadata } from "next";

import { AuthShell } from "@/src/components/auth/auth-shell";
import { ResetPasswordForm } from "@/src/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Reset Kata Sandi", description: "Buat kata sandi baru akun CocokIn." };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token;
  return (
    <AuthShell
      title="Buat kata sandi baru"
      description="Gunakan kata sandi unik dengan minimal delapan karakter."
      contextTitle="Pulihkan akses dengan aman"
      context={<p>Link reset berlaku satu jam dan hanya dapat digunakan sekali.</p>}
    >
      {token ? <ResetPasswordForm token={token} /> : <div className="auth-alert" role="alert"><p>Token reset tidak tersedia.</p></div>}
    </AuthShell>
  );
}
