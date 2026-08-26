import type { CareerDomain, CareerDomainId } from "./types";

/**
 * Master career taxonomy — PRD §3.1 FR-TAL-02.
 * Benchmarks are industry-standard minimums (0-100) for entry-level readiness.
 * ponytail: hardcoded data; move to DB when admin needs CRUD.
 */
export const CAREER_TAXONOMY: Record<CareerDomainId, CareerDomain> = {
  "frontend-dev": {
    id: "frontend-dev",
    label: "Frontend Developer",
    technicalSkills: [
      { skillId: "html", name: "HTML", benchmarkScore: 75 },
      { skillId: "css", name: "CSS", benchmarkScore: 70 },
      { skillId: "javascript", name: "JavaScript", benchmarkScore: 70 },
      { skillId: "react", name: "React", benchmarkScore: 60 },
      { skillId: "tailwind", name: "Tailwind CSS", benchmarkScore: 55 },
      { skillId: "nextjs", name: "Next.js", benchmarkScore: 50 },
    ],
    softSkills: [
      { skillId: "problem-solving", name: "Problem Solving", benchmarkScore: 65 },
      { skillId: "communication", name: "Komunikasi Profesional", benchmarkScore: 60 },
      { skillId: "digital-literacy", name: "Digital Literacy", benchmarkScore: 70 },
    ],
  },
  "ui-ux-designer": {
    id: "ui-ux-designer",
    label: "UI/UX Designer",
    technicalSkills: [
      { skillId: "figma", name: "Figma", benchmarkScore: 70 },
      { skillId: "user-research", name: "User Research", benchmarkScore: 65 },
      { skillId: "wireframing", name: "Wireframing", benchmarkScore: 60 },
      { skillId: "prototyping", name: "Prototyping", benchmarkScore: 60 },
      { skillId: "design-system", name: "Design System", benchmarkScore: 55 },
    ],
    softSkills: [
      { skillId: "problem-solving", name: "Problem Solving", benchmarkScore: 65 },
      { skillId: "communication", name: "Komunikasi Profesional", benchmarkScore: 65 },
      { skillId: "digital-literacy", name: "Digital Literacy", benchmarkScore: 65 },
    ],
  },
  "data-analyst": {
    id: "data-analyst",
    label: "Data Analyst",
    technicalSkills: [
      { skillId: "sql", name: "SQL", benchmarkScore: 70 },
      { skillId: "python", name: "Python", benchmarkScore: 60 },
      { skillId: "excel", name: "Excel / Spreadsheet", benchmarkScore: 65 },
      { skillId: "analytics", name: "Spreadsheet Analytics", benchmarkScore: 55 },
      { skillId: "visualization", name: "Tableau / Power BI", benchmarkScore: 50 },
    ],
    softSkills: [
      { skillId: "problem-solving", name: "Problem Solving", benchmarkScore: 70 },
      { skillId: "communication", name: "Komunikasi Profesional", benchmarkScore: 60 },
      { skillId: "digital-literacy", name: "Digital Literacy", benchmarkScore: 65 },
    ],
  },
  "digital-marketer": {
    id: "digital-marketer",
    label: "Digital Marketer",
    technicalSkills: [
      { skillId: "seo", name: "SEO", benchmarkScore: 60 },
      { skillId: "content-strategy", name: "Content Strategy", benchmarkScore: 60 },
      { skillId: "meta-ads", name: "Meta Ads", benchmarkScore: 55 },
      { skillId: "google-analytics", name: "Google Analytics", benchmarkScore: 55 },
      { skillId: "copywriting", name: "Copywriting", benchmarkScore: 60 },
    ],
    softSkills: [
      { skillId: "problem-solving", name: "Problem Solving", benchmarkScore: 60 },
      { skillId: "communication", name: "Komunikasi Profesional", benchmarkScore: 70 },
      { skillId: "digital-literacy", name: "Digital Literacy", benchmarkScore: 70 },
    ],
  },
};

export function getCareerDomain(id: CareerDomainId): CareerDomain {
  return CAREER_TAXONOMY[id];
}

export function getAllCareerIds(): CareerDomainId[] {
  return Object.keys(CAREER_TAXONOMY) as CareerDomainId[];
}
