"use client";

import { useState } from "react";
import type {
  TalentMatchProfile,
} from "@/src/modules/matching/types";
import type { CareerDomainId } from "@/src/modules/talent/types";
import { calculateCocokScore } from "@/src/modules/matching";
import { getAllCareerIds, getCareerDomain } from "@/src/modules/talent/career-taxonomy";
import { useTalent } from "@/src/context/talent-context";
import { createSeededProjects } from "@/src/fixtures/seeded-demo";
import { getReadinessSkillGapIds } from "@/src/modules/talent";
import { ProjectCard } from "./project-card";

export function ProjectCatalog() {
  const { profile, passport, latestReadinessResult } = useTalent();
  const [filterCareer, setFilterCareer] = useState<CareerDomainId | "all">("all");
  const careerIds = getAllCareerIds();

  // Susun live talent match profile dari context
  const liveTalentProfile: TalentMatchProfile = {
    skills: passport.entries.map((e) => ({
      skillId: e.skillId,
      name: e.name,
      level: e.evidenceLevel,
    })),
    targetCareerId: latestReadinessResult?.careerId ?? profile.targetCareerId,
    majorSkillGapIds: getReadinessSkillGapIds(latestReadinessResult),
    availability: profile.availability,
    completedProjectsCount: 2, // fixture count
    workModePreference: profile.workModePreference,
    city: profile.city,
  };

  const allProjects = createSeededProjects();
  const projects = filterCareer === "all"
    ? allProjects
    : allProjects.filter((p) => p.project.targetCareerId === filterCareer);

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
