import { describe, expect, it } from "vitest";
import { canPublishPortfolio, sanitizePublicPortfolio } from "./portfolio-guard";
import type { PortfolioEntry } from "./types";

describe("Verified Portfolio Domain & Business Rules (FR-TAL-04, BR-CONSENT)", () => {
  const baseEntry: PortfolioEntry = {
    id: "port-001",
    projectId: "prj-001",
    talentId: "talent-01",
    businessName: "Warung Bu Siti",
    businessAttributionApproved: false,
    talentPublicationConsentGranted: false,
    visibility: "PRIVATE",
    title: "Website Katalog Digital Warung Bu Siti",
    problemSummary: "Katalog menu fisik sering rusak dan pesanan via WA belum terstruktur.",
    solutionSummary: "Membangun katalog responsif berbasis web dengan integrasi pesan WhatsApp otomatis.",
    appliedSkillIds: ["html", "css", "javascript", "react"],
    completedAt: "2026-08-20T10:00:00Z",
    stagingUrl: "https://staging.warungbusiti.id",
    verifiedByUmkm: true,
    serviceValue: 1500000,
    chatMessageCount: 42,
  };

  it("denies publication if Talent has not granted consent", () => {
    const entry = { ...baseEntry, businessAttributionApproved: true, talentPublicationConsentGranted: false };
    expect(canPublishPortfolio(entry)).toBe(false);
  });

  it("denies publication if UMKM has not approved attribution", () => {
    const entry = { ...baseEntry, businessAttributionApproved: false, talentPublicationConsentGranted: true };
    expect(canPublishPortfolio(entry)).toBe(false);
  });

  it("allows publication only when BOTH Talent consent and UMKM attribution are granted", () => {
    const entry = { ...baseEntry, businessAttributionApproved: true, talentPublicationConsentGranted: true };
    expect(canPublishPortfolio(entry)).toBe(true);
  });

  it("sanitizes public portfolio view: strips financial and private data", () => {
    const publicView = sanitizePublicPortfolio(baseEntry);

    expect(publicView.title).toBe(baseEntry.title);
    expect(publicView.businessName).toBe(baseEntry.businessName);
    expect(publicView.problemSummary).toBe(baseEntry.problemSummary);
    expect(publicView.solutionSummary).toBe(baseEntry.solutionSummary);
    expect(publicView.appliedSkillIds).toEqual(baseEntry.appliedSkillIds);
    expect(publicView.verifiedByUmkm).toBe(true);

    // Harus bebas dari data finansial / chat / URL internal per ZAKY-05 & CONTEXT.md
    expect(publicView).not.toHaveProperty("serviceValue");
    expect(publicView).not.toHaveProperty("chatMessageCount");
  });
});
