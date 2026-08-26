import {
  cloneSeed,
  SEED_METADATA,
  type SeededRecord,
  type SeedTalentPassport,
  type SeedTalentProfile,
} from "./types";

export const SEEDED_TALENT_PROFILE: SeededRecord<SeedTalentProfile> = {
  id: "talent-nadia",
  name: "Nadia Putri",
  university: "Universitas Teknologi Nusantara",
  major: "Teknik Informatika",
  graduationYear: "2026",
  bio: "Mahasiswa tingkat akhir yang antusias membangun web app modern dengan Next.js dan Tailwind CSS.",
  targetCareerId: "frontend-dev",
  availability: "PART_TIME",
  workModePreference: "REMOTE",
  city: "Bandung",
  externalLinks: {
    github: "https://github.com/cocokin-demo-nadia",
    linkedin: "https://www.linkedin.com/in/cocokin-demo-nadia",
    portfolio: "https://nadia.demo.cocokin.test",
  },
  consents: {
    termsAndPrivacy: true,
    publicPortfolio: true,
    marketingResearch: false,
    displayOnly: true,
  },
  displayOnly: true,
  completedProjectsCount: 2,
  skillScores: [
    { skillId: "html", name: "HTML", talentScore: 90 },
    { skillId: "css", name: "CSS", talentScore: 70 },
    { skillId: "javascript", name: "JavaScript", talentScore: 50 },
    { skillId: "react", name: "React", talentScore: 60 },
    { skillId: "tailwind", name: "Tailwind CSS", talentScore: 55 },
    { skillId: "nextjs", name: "Next.js", talentScore: 30 },
  ],
  passportEntries: [
    {
      skillId: "html",
      name: "HTML",
      evidenceLevel: "ASSESSED",
      assessedScore: 90,
      verifiedProjectCount: 0,
      lastUpdated: "2026-08-26T00:00:00.000Z",
    },
    {
      skillId: "css",
      name: "CSS",
      evidenceLevel: "ASSESSED",
      assessedScore: 70,
      verifiedProjectCount: 0,
      lastUpdated: "2026-08-26T00:00:00.000Z",
    },
    {
      skillId: "javascript",
      name: "JavaScript",
      evidenceLevel: "SELF_DECLARED",
      verifiedProjectCount: 0,
      lastUpdated: "2026-08-26T00:00:00.000Z",
    },
    {
      skillId: "react",
      name: "React",
      evidenceLevel: "PROJECT_VERIFIED",
      verifiedProjectCount: 2,
      lastUpdated: "2026-08-26T00:00:00.000Z",
    },
  ],
  ...SEED_METADATA,
};

export function createSeededTalentProfile(): SeededRecord<SeedTalentProfile> {
  return cloneSeed(SEEDED_TALENT_PROFILE);
}

export const SEEDED_TALENT_READINESS_SCORES = SEEDED_TALENT_PROFILE.skillScores;

export function createSeededTalentPassport(): SeededRecord<SeedTalentPassport> {
  return {
    id: "passport-talent-nadia",
    talentId: SEEDED_TALENT_PROFILE.id,
    careerId: SEEDED_TALENT_PROFILE.targetCareerId,
    entries: cloneSeed(SEEDED_TALENT_PROFILE.passportEntries),
    ...SEED_METADATA,
  };
}
