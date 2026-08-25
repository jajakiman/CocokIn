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

const DEFAULT_CAREER: CareerDomainId = "frontend-dev";

const INITIAL_PROFILE: TalentProfileData = {
  id: "talent-nadia",
  name: "Nadia Putri",
  university: "Institut Teknologi Bandung",
  major: "Teknik Informatika",
  graduationYear: "2026",
  bio: "Mahasiswa tingkat akhir yang antusias membangun web app modern dengan Next.js dan Tailwind CSS.",
  targetCareerId: DEFAULT_CAREER,
  availability: "PART_TIME",
  workModePreference: "REMOTE",
  city: "Bandung",
  externalLinks: {
    github: "https://github.com/nadiaputri",
    linkedin: "https://linkedin.com/in/nadiaputri",
    portfolio: "https://nadiaputri.dev",
  },
  consents: {
    termsAndPrivacy: true,
    publicPortfolio: true,
    marketingResearch: false,
  },
};

function createInitialPassport(careerId: CareerDomainId): TalentSkillPassport {
  const career = CAREER_TAXONOMY[careerId];
  const allSkills = [...career.technicalSkills, ...career.softSkills].map((s) => ({
    skillId: s.skillId,
    name: s.name,
  }));
  const passport = createPassport("talent-nadia", careerId, allSkills);
  // Default fixture demo skills
  if (passport.entries[0]) {
    passport.entries[0].evidenceLevel = "ASSESSED";
    passport.entries[0].assessedScore = 90;
  }
  if (passport.entries[1]) {
    passport.entries[1].evidenceLevel = "ASSESSED";
    passport.entries[1].assessedScore = 70;
  }
  if (passport.entries[3]) {
    passport.entries[3].evidenceLevel = "PROJECT_VERIFIED";
    passport.entries[3].verifiedProjectCount = 2;
  }
  return passport;
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
      const saved = localStorage.getItem("cocokin_talent_profile");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_PROFILE;
  });

  const [passport, setPassport] = useState<TalentSkillPassport>(() => {
    return createInitialPassport(profile.targetCareerId);
  });

  const [latestReadinessResult, setLatestReadinessResult] =
    useState<CareerReadinessResult | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cocokin_talent_profile", JSON.stringify(profile));
    }
  }, [profile]);

  const updateProfile = (updates: Partial<TalentProfileData>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      if (updates.targetCareerId && updates.targetCareerId !== prev.targetCareerId) {
        setPassport(createInitialPassport(updates.targetCareerId));
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

    setPassport((prev) => markAssessed(prev, assessedIds, scoreMap));
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
