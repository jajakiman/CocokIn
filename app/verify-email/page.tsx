import type { Metadata } from "next";
import { cookies } from "next/headers";

import { AuthShell } from "@/src/components/auth/auth-shell";
import { VerifyEmailCard } from "@/src/components/auth/verify-email-card";

export const metadata: Metadata = { title: "Verifikasi Email", description: "Verifikasi alamat email akun CocokIn." };

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const email = (await cookies()).get("pending_verification")?.value;
  const invalid = (await searchParams).error === "invalid";
  return (
    <AuthShell
      title="Verifikasi email"
      description="Selesaikan satu langkah keamanan sebelum masuk ke ruang kerja CocokIn."
      contextTitle="Identitas yang terverifikasi membangun kepercayaan"
      context={<p>Email terverifikasi membantu melindungi akun, komunikasi proyek, dan bukti kerja Anda.</p>}
    >
      <VerifyEmailCard email={email} invalid={invalid} />
    </AuthShell>
  );
}
