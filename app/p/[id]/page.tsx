import { PublicPassportCard } from "@/src/components/talent/public-passport-card";
import { createPassport } from "@/src/modules/talent/skill-passport";
import { CAREER_TAXONOMY } from "@/src/modules/talent/career-taxonomy";

export default async function PublicPassportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fixture / fallback data untuk demonstrasi public passport view
  const career = CAREER_TAXONOMY["frontend-dev"];
  const allSkills = [...career.technicalSkills, ...career.softSkills].map((s) => ({
    skillId: s.skillId,
    name: s.name,
  }));

  const mockPassport = createPassport(id, "frontend-dev", allSkills);
  if (mockPassport.entries[0]) {
    mockPassport.entries[0].evidenceLevel = "ASSESSED";
    mockPassport.entries[0].assessedScore = 95;
  }
  if (mockPassport.entries[1]) {
    mockPassport.entries[1].evidenceLevel = "ASSESSED";
    mockPassport.entries[1].assessedScore = 80;
  }
  if (mockPassport.entries[3]) {
    mockPassport.entries[3].evidenceLevel = "PROJECT_VERIFIED";
    mockPassport.entries[3].verifiedProjectCount = 3;
  }

  return (
    <div className="public-passport-page">
      <PublicPassportCard
        talentName="Nadia Putri"
        university="Institut Teknologi Bandung"
        major="Teknik Informatika"
        passport={mockPassport}
      />
    </div>
  );
}
