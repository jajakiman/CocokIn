import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthShell } from "@/src/components/auth/auth-shell";
import { RegistrationForm } from "@/src/components/auth/registration-form";
import * as serverActions from "@/src/adapters/auth/server-adapter";
import type { PublicRegistrationRole, AuthUiAdapter } from "@/src/auth-ui/types";

const serverAdapter: AuthUiAdapter = {
  loginWithCredentials: serverActions.loginWithCredentials,
  loginWithGoogle: serverActions.loginWithGoogle as any,
  register: serverActions.register,
  requestPasswordReset: serverActions.requestPasswordReset as any,
  logout: serverActions.logout as any
};

export const metadata: Metadata = {
  title: "Daftar",
  description: "Daftar ke CocokIn.",
};

export default function RoleRegistrationPage({ params }: { params: { role: string } }) {
  const roleRaw = params.role.toUpperCase();
  if (roleRaw !== "TALENT" && roleRaw !== "BUSINESS") {
    return notFound();
  }

  const role: PublicRegistrationRole = roleRaw as PublicRegistrationRole;
  
  const isBusiness = role === "BUSINESS";

  return (
    <AuthShell
      title={`Daftar sebagai ${isBusiness ? "UMKM" : "Talent"}`}
      description="Lengkapi data diri Anda untuk memulai."
      contextTitle="Langkah awal ekosistem kerja yang terukur"
      context={<p>{isBusiness ? "Dapatkan solusi digital praktis dengan talenta terverifikasi." : "Uji skill dan bangun portofolio nyata."}</p>}
    >
      <RegistrationForm adapter={serverAdapter} role={role} />
    </AuthShell>
  );
}
