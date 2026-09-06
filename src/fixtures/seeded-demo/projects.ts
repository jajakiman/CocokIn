import { cloneSeed, SEED_METADATA, type SeededRecord, type SeedProject } from "./types";

export const SEEDED_PROJECTS: SeededRecord<SeedProject>[] = [
  {
    id: "prj-001",
    title: "Website Katalog Warung Bu Siti",
    businessId: "business-warung-siti",
    businessName: "Warung Bu Siti",
    project: {
      requiredSkills: [
        { skillId: "html-css", name: "HTML & CSS" },
        { skillId: "javascript", name: "JavaScript / TypeScript" },
        { skillId: "react-nextjs", name: "React & Next.js" },
      ],
      targetCareerId: "fullstack-dev",
      difficulty: "BEGINNER",
      durationDays: 8,
      workMode: "REMOTE",
    },
    ...SEED_METADATA,
  },
  {
    id: "prj-002",
    title: "Landing Page Kopi Lereng",
    businessId: "business-kopi-lereng",
    businessName: "Kopi Lereng Manglayang",
    project: {
      requiredSkills: [
        { skillId: "html-css", name: "HTML & CSS" },
        { skillId: "responsive-ui", name: "Responsive UI" },
      ],
      targetCareerId: "fullstack-dev",
      difficulty: "BEGINNER",
      durationDays: 5,
      workMode: "REMOTE",
    },
    ...SEED_METADATA,
  },
  {
    id: "prj-003",
    title: "Redesign App Laundry Kiloan",
    businessId: "business-laundryku",
    businessName: "LaundryKu",
    project: {
      requiredSkills: [
        { skillId: "figma", name: "Figma" },
        { skillId: "user-research", name: "User Research" },
        { skillId: "wireframing", name: "Wireframing" },
        { skillId: "prototyping", name: "Prototyping" },
      ],
      targetCareerId: "ui-ux-designer",
      difficulty: "INTERMEDIATE",
      durationDays: 10,
      workMode: "HYBRID",
      city: "Bandung",
    },
    ...SEED_METADATA,
  },
  {
    id: "prj-004",
    title: "Dashboard Penjualan Toko Roti",
    businessId: "business-roti-manis",
    businessName: "Roti Manis Bakery",
    project: {
      requiredSkills: [
        { skillId: "excel", name: "Excel / Spreadsheet" },
        { skillId: "sql", name: "SQL" },
        { skillId: "visualization", name: "Tableau / Power BI" },
      ],
      targetCareerId: "data-analyst",
      difficulty: "INTERMEDIATE",
      durationDays: 12,
      workMode: "REMOTE",
    },
    ...SEED_METADATA,
  },
  {
    id: "prj-005",
    title: "Kampanye Instagram Kedai Kopi",
    businessId: "business-kedai-kopi",
    businessName: "Kedai Kopi Nusantara",
    project: {
      requiredSkills: [
        { skillId: "content-strategy", name: "Content Strategy" },
        { skillId: "meta-ads", name: "Meta Ads" },
        { skillId: "copywriting", name: "Copywriting" },
      ],
      targetCareerId: "digital-marketer",
      difficulty: "BEGINNER",
      durationDays: 7,
      workMode: "REMOTE",
    },
    ...SEED_METADATA,
  },
  {
    id: "prj-006",
    title: "Aplikasi Booking Salon Kecantikan",
    businessId: "business-salon-cantik",
    businessName: "Salon Cantik Bunda",
    project: {
      requiredSkills: [
        { skillId: "react-nextjs", name: "React & Next.js" },
        { skillId: "api-design", name: "REST API Design" },
        { skillId: "database", name: "Database & SQL" },
        { skillId: "auth-security", name: "Auth & Security" },
        { skillId: "deployment", name: "Deployment & DevOps" },
      ],
      targetCareerId: "fullstack-dev",
      difficulty: "ADVANCED",
      durationDays: 14,
      workMode: "HYBRID",
      city: "Bandung",
    },
    ...SEED_METADATA,
  },
];

export function createSeededProjects(): SeededRecord<SeedProject>[] {
  return cloneSeed(SEEDED_PROJECTS);
}
