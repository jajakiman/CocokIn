import { AppShell } from "@/src/design-system/app-shell";
import { SkillGapChart } from "@/src/components/talent/skill-gap-chart";
import { SEEDED_TALENT_READINESS_SCORES } from "@/src/fixtures/seeded-demo";

export default function SkillGapPage() {
  return (
    <AppShell role="talent">
      <SkillGapChart careerId="frontend-dev" scores={SEEDED_TALENT_READINESS_SCORES} />
    </AppShell>
  );
}
