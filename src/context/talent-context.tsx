"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AvailabilityType, WorkMode } from "@/src/modules/matching/types";
import type {
  CareerDomainId,
  CareerReadinessResult,
  TalentSkillPassport,
} from "@/src/modules/talent/types";
import { CAREER_TAXONOMY } from "@/src/modules/talent/career-taxonomy";
import { createPassport, markAssessed } from "@/src/modules/talent/skill-passport";
import {
  createSeededTalentPassport,
  createSeededTalentProfile,
} from "@/src/fixtures/seeded-demo";

export type ConsentSettings = {
  termsAndPrivacy: boolean; // Required
  publicPortfolio: boolean; // Optional
  marketingResearch: boolean; // Optional
};

export type TalentProfileData = {
  id: string;
  name: string;
  university: string;
  major: string;
  graduationYear: string;
  bio: string;
  targetCareerId: CareerDomainId;
  availability: AvailabilityType;
  workModePreference: WorkMode;
  city: string;
  externalLinks: {
    github?: string;
    linkedin?: string;
    figma?: string;
    portfolio?: string;
  };
  consents: ConsentSettings;
};

const SEED_DRAFT_KEY = "cocokin_seeded_demo_talent_draft";

function createInitialPassport(careerId: CareerDomainId): TalentSkillPassport {
  if (careerId === "frontend-dev") {
    return createSeededTalentPassport();
  }
  const career = CAREER_TAXONOMY[careerId];
  const allSkills = [...career.technicalSkills, ...career.softSkills].map((s) => ({
    skillId: s.skillId,
    name: s.name,
  }));
  return createPassport("talent-nadia", careerId, allSkills);
}

type TalentContextValue = {
  profile: TalentProfileData;
  passport: TalentSkillPassport;
  latestReadinessResult: CareerReadinessResult | null;
  updateProfile: (updates: Partial<TalentProfileData>) => void;
  updateConsents: (updates: Partial<ConsentSettings>) => void;
  applyAssessmentResult: (result: CareerReadinessResult) => void;
};

const TalentContext = createContext<TalentContextValue | null>(null);

export function TalentProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<TalentProfileData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SEED_DRAFT_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return createSeededTalentProfile();
  });

  const [passport, setPassport] = useState<TalentSkillPassport>(() => {
    return createInitialPassport(profile.targetCareerId);
  });

  const [latestReadinessResult, setLatestReadinessResult] =
    useState<CareerReadinessResult | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(SEED_DRAFT_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  const updateProfile = (updates: Partial<TalentProfileData>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      if (updates.targetCareerId && updates.targetCareerId !== prev.targetCareerId) {
        setPassport(createInitialPassport(updates.targetCareerId));
        setLatestReadinessResult(null);
      }
      return next;
    });
  };

  const updateConsents = (updates: Partial<ConsentSettings>) => {
    setProfile((prev) => ({
      ...prev,
      consents: { ...prev.consents, ...updates },
    }));
  };

  const applyAssessmentResult = (result: CareerReadinessResult) => {
    setLatestReadinessResult(result);
    // Auto promote assessed skills in passport
    const scoreMap = new Map<string, number>();
    const assessedIds: string[] = [];

    for (const item of [...result.technicalBreakdown, ...result.softSkillBreakdown]) {
      scoreMap.set(item.skillId, item.talentScore);
      assessedIds.push(item.skillId);
    }

    setPassport((prev) => {
      const careerPassport = prev.careerId === result.careerId
        ? prev
        : createInitialPassport(result.careerId);
      return markAssessed(careerPassport, assessedIds, scoreMap);
    });
  };

  return (
    <TalentContext.Provider
      value={{
        profile,
        passport,
        latestReadinessResult,
        updateProfile,
        updateConsents,
        applyAssessmentResult,
      }}
    >
      {children}
    </TalentContext.Provider>
  );
}

export function useTalent() {
  const context = useContext(TalentContext);
  if (!context) {
    throw new Error("useTalent must be used within a TalentProvider");
  }
  return context;
}
