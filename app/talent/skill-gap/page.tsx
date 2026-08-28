"use client";

import { AppShell } from "@/src/design-system/app-shell";
import { SkillGapChart } from "@/src/components/talent/skill-gap-chart";
import { SEEDED_TALENT_READINESS_SCORES } from "@/src/fixtures/seeded-demo";
import { useTalent } from "@/src/context/talent-context";
import { resolveSkillGapInput } from "@/src/modules/talent";

export default function SkillGapPage() {
  const { latestReadinessResult, profile } = useTalent();
  const input = resolveSkillGapInput(
    latestReadinessResult,
    profile.targetCareerId,
    SEEDED_TALENT_READINESS_SCORES,
  );

  return (
    <AppShell role="talent">
      <SkillGapChart
        careerId={input.careerId}
        scores={input.scores}
      />
    </AppShell>
  );
}
