import { describe, expect, test } from "vitest";
import {
  createSeededBusinessProfile,
  createSeededDemoRecords,
  createSeededIdentities,
  createSeededPortfolioEntries,
  createSeededProjects,
  createSeededTalentPassport,
  createSeededTalentProfile,
  createSeededWorkspace,
} from "./index";

function collectKeys(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectKeys);
  if (!value || typeof value !== "object") return [];

  return Object.entries(value).flatMap(([key, child]) => [key, ...collectKeys(child)]);
}

describe("seeded demo fixtures", () => {
  test("marks every top-level record as synthetic seeded demo data", () => {
    const records = createSeededDemoRecords();
    expect(records.length).toBeGreaterThan(0);

    for (const record of records) {
      expect(record.source).toBe("SEEDED_DEMO");
      expect(record.synthetic).toBe(true);
    }
  });

  test("keeps fixture IDs deterministic", () => {
    expect(createSeededDemoRecords().map((record) => record.id)).toEqual([
      "identity-talent-nadia",
      "identity-business-warung-siti",
      "talent-nadia",
      "passport-talent-nadia",
      "business-warung-siti",
      "prj-001",
      "prj-002",
      "prj-003",
      "prj-004",
      "prj-005",
      "prj-006",
      "port-001",
      "port-002",
      "prj-act-01",
    ]);
  });

  test("does not embed credential-shaped keys", () => {
    expect(collectKeys(createSeededDemoRecords())).not.toEqual(
      expect.arrayContaining([
        expect.stringMatching(/password|credential|secret|token|apikey/i),
      ]),
    );
  });

  test("marks synthetic consent-bearing records as display-only", () => {
    const consentRecords = createSeededDemoRecords().filter((record) =>
      collectKeys(record).some((key) => /consent|attributionApproved/i.test(key)),
    );

    expect(consentRecords.length).toBeGreaterThan(0);
    for (const record of consentRecords) {
      expect(record).toMatchObject({ displayOnly: true });
    }
  });

  test("returns deep-independent mutable copies", () => {
    const firstProfile = createSeededTalentProfile();
    const secondProfile = createSeededTalentProfile();
    firstProfile.externalLinks.github = "https://example.test/changed";

    expect(firstProfile).not.toBe(secondProfile);
    expect(firstProfile.externalLinks).not.toBe(secondProfile.externalLinks);
    expect(secondProfile.externalLinks.github).toBe("https://github.com/cocokin-demo-nadia");

    const firstPassport = createSeededTalentPassport();
    const secondPassport = createSeededTalentPassport();
    firstPassport.entries[0].name = "changed";

    expect(firstPassport).not.toBe(secondPassport);
    expect(firstPassport.entries).not.toBe(secondPassport.entries);
    expect(secondPassport.entries[0].name).toBe("HTML & CSS");
    expect(secondPassport).toMatchObject({ source: "SEEDED_DEMO", synthetic: true });

    const firstIdentities = createSeededIdentities();
    const secondIdentities = createSeededIdentities();
    firstIdentities[0].displayName = "changed";

    expect(firstIdentities).not.toBe(secondIdentities);
    expect(firstIdentities[0]).not.toBe(secondIdentities[0]);
    expect(secondIdentities[0].displayName).toBe("Nadia Putri");

    const firstBusiness = createSeededBusinessProfile();
    const secondBusiness = createSeededBusinessProfile();
    firstBusiness.description = "changed";

    expect(firstBusiness).not.toBe(secondBusiness);
    expect(secondBusiness.description).toContain("Warung makan sintetis");

    const firstProjects = createSeededProjects();
    const secondProjects = createSeededProjects();
    firstProjects[0].project.requiredSkills[0].name = "changed";

    expect(firstProjects).not.toBe(secondProjects);
    expect(firstProjects[0].project).not.toBe(secondProjects[0].project);
    expect(firstProjects[0].project.requiredSkills).not.toBe(
      secondProjects[0].project.requiredSkills,
    );
    expect(secondProjects[0].project.requiredSkills[0].name).toBe("HTML & CSS");

    const firstPortfolio = createSeededPortfolioEntries();
    const secondPortfolio = createSeededPortfolioEntries();
    firstPortfolio[0].appliedSkillIds.push("changed");

    expect(firstPortfolio).not.toBe(secondPortfolio);
    expect(firstPortfolio[0]).not.toBe(secondPortfolio[0]);
    expect(secondPortfolio[0].appliedSkillIds).toEqual([
      "HTML",
      "CSS",
      "JavaScript",
      "Tailwind CSS",
    ]);
    const firstWorkspace = createSeededWorkspace();
    const secondWorkspace = createSeededWorkspace();
    firstWorkspace.milestones[0].title = "changed";

    expect(firstWorkspace).not.toBe(secondWorkspace);
    expect(firstWorkspace.milestones).not.toBe(secondWorkspace.milestones);
    expect(secondWorkspace.milestones[0].title).toBe("Desain UI & Struktur Menu Katalog");
  });
});
