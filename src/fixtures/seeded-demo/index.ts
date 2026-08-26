export * from "./types";
export * from "./identity";
export * from "./talent";
export * from "./business";
export * from "./projects";
export * from "./portfolio";
export * from "./workspace";

import { SEEDED_BUSINESS_PROFILE } from "./business";
import { createSeededIdentities } from "./identity";
import { SEEDED_PORTFOLIO_ENTRIES } from "./portfolio";
import { SEEDED_PROJECTS } from "./projects";
import { createSeededTalentPassport, SEEDED_TALENT_PROFILE } from "./talent";
import { cloneSeed } from "./types";
import { SEEDED_WORKSPACE } from "./workspace";

export function createSeededDemoRecords() {
  return cloneSeed([
    ...createSeededIdentities(),
    SEEDED_TALENT_PROFILE,
    createSeededTalentPassport(),
    SEEDED_BUSINESS_PROFILE,
    ...SEEDED_PROJECTS,
    ...SEEDED_PORTFOLIO_ENTRIES,
    SEEDED_WORKSPACE,
  ]);
}
