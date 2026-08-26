"use client";

import { AppShell } from "@/src/design-system/app-shell";
import { SkillPassportView } from "@/src/components/talent/skill-passport-view";
import { useTalent } from "@/src/context/talent-context";

export default function PassportPage() {
  const { passport } = useTalent();

  return (
    <AppShell role="talent">
      <SkillPassportView passport={passport} />
    </AppShell>
  );
}
