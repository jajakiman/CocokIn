import { AppShell } from "@/src/design-system/app-shell";
import { SkillPassportView } from "@/src/components/talent/skill-passport-view";
import { createPassport } from "@/src/modules/talent/skill-passport";
import { CAREER_TAXONOMY } from "@/src/modules/talent/career-taxonomy";

export default function PassportPage() {
  // Fixture data — akan diganti dengan real data dari database
  const career = CAREER_TAXONOMY["frontend-dev"];
  const allSkills = [...career.technicalSkills, ...career.softSkills].map((s) => ({
    skillId: s.skillId,
    name: s.name,
  }));

  const mockPassport = createPassport("talent-123", "frontend-dev", allSkills);

  // Simulasi beberapa skills sudah assessed
  mockPassport.entries[0].evidenceLevel = "ASSESSED";
  mockPassport.entries[0].assessedScore = 90;
  mockPassport.entries[1].evidenceLevel = "ASSESSED";
  mockPassport.entries[1].assessedScore = 70;
  mockPassport.entries[3].evidenceLevel = "PROJECT_VERIFIED";
  mockPassport.entries[3].verifiedProjectCount = 2;

  return (
    <AppShell role="talent">
      <SkillPassportView passport={mockPassport} />
    </AppShell>
  );
}
