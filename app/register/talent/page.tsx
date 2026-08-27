import type { Metadata } from "next";

import { AuthShell } from "@/src/components/auth/auth-shell";
import { UnavailableRegistrationForm } from "@/src/components/auth/registration-form";

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
      <UnavailableRegistrationForm role="TALENT" />
    </AuthShell>
  );
}
