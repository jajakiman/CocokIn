import type { Metadata } from "next";

import { AuthShell } from "@/src/components/auth/auth-shell";
import { UnavailableRegistrationForm } from "@/src/components/auth/registration-form";

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
      <UnavailableRegistrationForm role="BUSINESS" />
    </AuthShell>
  );
}
