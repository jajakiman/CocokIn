import { redirect } from "next/navigation";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { BusinessOnboardingWizard } from "@/src/components/business/business-onboarding-wizard";
import { AppShell } from "@/src/design-system/app-shell";

export async function generateMetadata() {
  return { title: "Profil Awal UMKM | CocokIn" };
}

export default async function BusinessProfilePage() {
  const session = await getSession();
  if (!session || session.role !== "BUSINESS") redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      businessProfile: {
        include: { assessments: { select: { id: true }, take: 1 } },
      },
    },
  });

  if (!user?.emailVerified) redirect("/verify-email");

  const profile = user.businessProfile;

  // Jika profile sudah lengkap dan asesmen sudah dikerjakan, arahkan langsung ke dashboard
  if (profile && profile.businessName && profile.assessments.length > 0) {
    redirect("/business");
  }

  return (
    <div className="relative min-h-[100dvh] bg-[#F7F9FC] font-sans">
      {/* Background Dashboard Mockup (Blurred Backdrop for authentic portal preview) */}
      <div aria-hidden="true" className="pointer-events-none select-none filter blur-[3px] opacity-40">
        <AppShell
          role="business"
          user={{
            id: user.id,
            email: user.email || "",
            displayName: profile?.businessName || user.name || "Pemilik Usaha",
            role: "BUSINESS",
          }}
        >
          <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center">
              <div className="h-10 w-56 bg-[#001040]/10 rounded-xl animate-pulse" />
              <div className="h-10 w-36 bg-[#001040]/10 rounded-xl" />
            </div>

            <div className="h-16 w-full bg-[#EAF3FF] border border-[#BAE6FD] rounded-xl" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-28 bg-white border border-[#D8E1EE] rounded-2xl p-4 shadow-sm" />
              <div className="h-28 bg-white border border-[#D8E1EE] rounded-2xl p-4 shadow-sm" />
              <div className="h-28 bg-white border border-[#D8E1EE] rounded-2xl p-4 shadow-sm" />
            </div>

            <div className="h-72 bg-white border border-[#D8E1EE] rounded-2xl p-6 shadow-sm" />
          </div>
        </AppShell>
      </div>

      {/* Backdrop Dimmer & Pop-up Modal Dialog Window */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001040]/50 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
        <BusinessOnboardingWizard
          initialBusinessName={profile?.businessName || ""}
          initialIndustry={profile?.industryCategory || ""}
          initialCity={profile?.location || ""}
          initialDescription={profile?.description || ""}
        />
      </div>
    </div>
  );
}
