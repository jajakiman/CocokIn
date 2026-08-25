"use client";

import { useState } from "react";
import type {
  ProjectMatchRequirement,
  TalentMatchProfile,
} from "@/src/modules/matching/types";
import type { CareerDomainId } from "@/src/modules/talent/types";
import { calculateCocokScore } from "@/src/modules/matching";
import { getAllCareerIds, getCareerDomain } from "@/src/modules/talent/career-taxonomy";
import { useTalent } from "@/src/context/talent-context";
import { ProjectCard } from "./project-card";

// ponytail: fixture data; replace with server-fetched projects when DB exists

type ProjectFixture = {
  id: string;
  title: string;
  businessName: string;
  project: ProjectMatchRequirement;
};

const MOCK_PROJECTS: ProjectFixture[] = [
  {
    id: "prj-001",
    title: "Website Katalog Warung Bu Siti",
    businessName: "Warung Bu Siti",
    project: {
      requiredSkills: [
        { skillId: "html", name: "HTML" },
        { skillId: "css", name: "CSS" },
        { skillId: "javascript", name: "JavaScript" },
        { skillId: "nextjs", name: "Next.js" },
      ],
      targetCareerId: "frontend-dev",
      difficulty: "BEGINNER",
      durationDays: 8,
      workMode: "REMOTE",
    },
  },
  {
    id: "prj-002",
    title: "Landing Page Kopi Lereng",
    businessName: "Kopi Lereng Manglayang",
    project: {
      requiredSkills: [
        { skillId: "html", name: "HTML" },
        { skillId: "css", name: "CSS" },
        { skillId: "tailwind", name: "Tailwind CSS" },
      ],
      targetCareerId: "frontend-dev",
      difficulty: "BEGINNER",
      durationDays: 5,
      workMode: "REMOTE",
    },
  },
  {
    id: "prj-003",
    title: "Redesign App Laundry Kiloan",
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
  },
  {
    id: "prj-004",
    title: "Dashboard Penjualan Toko Roti",
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
  },
  {
    id: "prj-005",
    title: "Kampanye Instagram Kedai Kopi",
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
  },
  {
    id: "prj-006",
    title: "Aplikasi Booking Salon Kecantikan",
    businessName: "Salon Cantik Bunda",
    project: {
      requiredSkills: [
        { skillId: "react", name: "React" },
        { skillId: "nextjs", name: "Next.js" },
        { skillId: "tailwind", name: "Tailwind CSS" },
        { skillId: "javascript", name: "JavaScript" },
      ],
      targetCareerId: "frontend-dev",
      difficulty: "ADVANCED",
      durationDays: 14,
      workMode: "HYBRID",
      city: "Bandung",
    },
  },
];

export function ProjectCatalog() {
  const { profile, passport } = useTalent();
  const [filterCareer, setFilterCareer] = useState<CareerDomainId | "all">("all");
  const careerIds = getAllCareerIds();

  // Susun live talent match profile dari context
  const liveTalentProfile: TalentMatchProfile = {
    skills: passport.entries.map((e) => ({
      skillId: e.skillId,
      name: e.name,
      level: e.evidenceLevel,
    })),
    targetCareerId: profile.targetCareerId,
    availability: profile.availability,
    completedProjectsCount: 2, // fixture count
    workModePreference: profile.workModePreference,
    city: profile.city,
  };

  const projects = filterCareer === "all"
    ? MOCK_PROJECTS
    : MOCK_PROJECTS.filter((p) => p.project.targetCareerId === filterCareer);

  const scoredProjects = projects
    .map((p) => ({
      ...p,
      scoreResult: calculateCocokScore(liveTalentProfile, p.project),
    }))
    .sort((a, b) => b.scoreResult.total - a.scoreResult.total);

  return (
    <div className="project-catalog">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Marketplace</p>
          <h1>Cari Proyek</h1>
          <p>Temukan micro-project yang cocok dengan skill dan target kariermu.</p>
        </div>
      </div>

      <div className="catalog-filter">
        <button
          type="button"
          className="filter-chip"
          data-active={filterCareer === "all"}
          onClick={() => setFilterCareer("all")}
        >
          Semua
        </button>
        {careerIds.map((id) => (
          <button
            type="button"
            key={id}
            className="filter-chip"
            data-active={filterCareer === id}
            onClick={() => setFilterCareer(id)}
          >
            {getCareerDomain(id).label}
          </button>
        ))}
      </div>

      <p className="catalog-count">
        {scoredProjects.length} proyek ditemukan, diurutkan berdasarkan Cocok Score
      </p>

      <div className="catalog-grid">
        {scoredProjects.map((p) => (
          <ProjectCard
            key={p.id}
            title={p.title}
            businessName={p.businessName}
            project={p.project}
            scoreResult={p.scoreResult}
          />
        ))}
      </div>

      {scoredProjects.length === 0 && (
        <div className="catalog-empty">
          <p>Belum ada proyek untuk kategori ini.</p>
        </div>
      )}
    </div>
  );
}
