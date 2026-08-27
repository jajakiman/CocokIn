import type { Metadata } from "next";

import { AuthShell } from "@/src/components/auth/auth-shell";
import { RoleChoice } from "@/src/components/auth/role-choice";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Pilih jalur pendaftaran CocokIn sebagai Talent atau UMKM.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Bergabung dengan CocokIn"
      description="Pilih peran yang sesuai dengan tujuan Anda."
      contextTitle="Dua jalur, satu ekosistem kerja yang terukur"
      context={<p>Talent dan UMKM memiliki pengalaman yang berbeda tanpa memisahkan standar kepercayaan, aksesibilitas, dan kualitas.</p>}
    >
      <RoleChoice />
    </AuthShell>
  );
}
