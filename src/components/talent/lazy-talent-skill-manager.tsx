"use client";

import dynamic from "next/dynamic";

import { SkillManagerLoading } from "@/src/design-system/talent-loading";
import type { ManagedSkill } from "./talent-skill-manager";

const TalentSkillManager = dynamic(() => import("./talent-skill-manager").then((module) => module.TalentSkillManager), {
  loading: SkillManagerLoading,
});

export function LazyTalentSkillManager(props: { skills: ManagedSkill[]; compact?: boolean; showHeading?: boolean }) {
  return <TalentSkillManager {...props} />;
}
