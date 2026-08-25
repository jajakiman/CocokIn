"use client";

import { useState } from "react";
import type {
  CocokScoreResult,
  ProjectMatchRequirement,
} from "@/src/modules/matching/types";
import { StatusBadge, type StatusTone } from "@/src/design-system/status-badge";
import { MatchBreakdown } from "./match-breakdown";

type ProjectCardProps = {
  title: string;
  businessName: string;
  project: ProjectMatchRequirement;
  scoreResult: CocokScoreResult;
};

function scoreTone(score: number): StatusTone {
  if (score >= 75) return "success";
  if (score >= 50) return "warning";
  return "destructive";
}

function scoreLabel(score: number): string {
  if (score >= 75) return "Sangat cocok";
  if (score >= 50) return "Cukup cocok";
  return "Kurang cocok";
}

const DIFFICULTY_LABEL: Record<string, string> = {
  BEGINNER: "Pemula",
  INTERMEDIATE: "Menengah",
  ADVANCED: "Lanjutan",
};

const WORK_MODE_LABEL: Record<string, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "Onsite",
};

export function ProjectCard({
  title,
  businessName,
  project,
  scoreResult,
}: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const tone = scoreTone(scoreResult.total);

  return (
    <article className="project-card">
      <div className="project-card__header">
        <div>
          <h3>{title}</h3>
          <p className="project-card__business">{businessName}</p>
        </div>
        <button
          type="button"
          className="cocok-score-button"
          data-tone={tone}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={`Cocok Score ${scoreResult.total}, klik untuk detail`}
        >
          <span className="cocok-score-button__value">{scoreResult.total}</span>
          <span className="cocok-score-button__label">{scoreLabel(scoreResult.total)}</span>
        </button>
      </div>

      <div className="project-card__meta">
        <StatusBadge tone="info">
          {DIFFICULTY_LABEL[project.difficulty] ?? project.difficulty}
        </StatusBadge>
        <StatusBadge tone="neutral">
          {project.durationDays} hari
        </StatusBadge>
        <StatusBadge tone="neutral">
          {WORK_MODE_LABEL[project.workMode] ?? project.workMode}
        </StatusBadge>
        {project.city && (
          <StatusBadge tone="neutral">{project.city}</StatusBadge>
        )}
      </div>

      <div className="project-card__skills">
        {project.requiredSkills.map((skill) => (
          <span key={skill.skillId} className="skill-tag">
            {skill.name}
          </span>
        ))}
      </div>

      {expanded && <MatchBreakdown result={scoreResult} />}
    </article>
  );
}
