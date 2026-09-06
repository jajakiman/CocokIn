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
  bio: "Mahasiswa tingkat akhir yang antusias membangun web app modern dari UI hingga API dan database dengan Next.js dan PostgreSQL.",
  targetCareerId: "fullstack-dev",
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
    { skillId: "html-css", name: "HTML & CSS", talentScore: 90 },
    { skillId: "javascript", name: "JavaScript / TypeScript", talentScore: 70 },
    { skillId: "react-nextjs", name: "React & Next.js", talentScore: 60 },
    { skillId: "responsive-ui", name: "Responsive UI", talentScore: 55 },
    { skillId: "git", name: "Git & Version Control", talentScore: 75 },
    { skillId: "api-design", name: "REST API Design", talentScore: 55 },
    { skillId: "database", name: "Database & SQL", talentScore: 40 },
    { skillId: "auth-security", name: "Auth & Security", talentScore: 30 },
    { skillId: "server-logic", name: "Backend Logic (Node.js)", talentScore: 45 },
    { skillId: "deployment", name: "Deployment & DevOps", talentScore: 30 },
  ],
  passportEntries: [
    {
      skillId: "html-css",
      name: "HTML & CSS",
      evidenceLevel: "ASSESSED",
      assessedScore: 90,
      verifiedProjectCount: 0,
      lastUpdated: "2026-08-26T00:00:00.000Z",
    },
    {
      skillId: "javascript",
      name: "JavaScript / TypeScript",
      evidenceLevel: "ASSESSED",
      assessedScore: 70,
      verifiedProjectCount: 0,
      lastUpdated: "2026-08-26T00:00:00.000Z",
    },
    {
      skillId: "api-design",
      name: "REST API Design",
      evidenceLevel: "SELF_DECLARED",
      verifiedProjectCount: 0,
      lastUpdated: "2026-08-26T00:00:00.000Z",
    },
    {
      skillId: "react-nextjs",
      name: "React & Next.js",
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
