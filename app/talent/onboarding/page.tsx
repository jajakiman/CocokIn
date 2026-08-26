import { PageHeader } from "@/src/design-system/page-header";
import { OnboardingForm } from "@/src/components/talent/onboarding-form";

export default function TalentOnboardingPage() {
  return (
    <main className="onboarding-page-shell">
      <div className="onboarding-page-container">
        <PageHeader
          eyebrow="Langkah Awal"
          title="Onboarding Talent CocokIn"
          description="Lengkapi profil, tentukan karier impianmu, dan siapkan Paspor Keahlian untuk mulai mengambil proyek mikro."
        />
        <OnboardingForm />
      </div>
    </main>
  );
}
