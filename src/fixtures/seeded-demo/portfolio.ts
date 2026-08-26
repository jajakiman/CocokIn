import { cloneSeed, SEED_METADATA, type SeedPortfolioEntry } from "./types";

export const SEEDED_PORTFOLIO_ENTRIES: SeedPortfolioEntry[] = [
  {
    id: "port-001",
    projectId: "prj-001",
    talentId: "talent-nadia",
    businessName: "Warung Bu Siti",
    businessAttributionApproved: true,
    talentPublicationConsentGranted: true,
    visibility: "PUBLIC",
    title: "Website Katalog & Pemesanan WhatsApp Warung Bu Siti",
    problemSummary:
      "Menu fisik warung makan sering tidak update saat stok habis dan pelanggan kesulitan pesan duluan.",
    solutionSummary:
      "Membangun web katalog responsif dengan filter menu dinamis dan tombol otomatis terhubung ke WhatsApp penjual.",
    appliedSkillIds: ["HTML", "CSS", "JavaScript", "Tailwind CSS"],
    completedAt: "2026-08-15T14:30:00Z",
    stagingUrl: "https://warung-siti.preview.cocokin.test",
    verifiedByUmkm: true,
    displayOnly: true,
    ...SEED_METADATA,
  },
  {
    id: "port-002",
    projectId: "prj-002",
    talentId: "talent-nadia",
    businessName: "Kopi Lereng Manglayang",
    businessAttributionApproved: true,
    talentPublicationConsentGranted: false,
    visibility: "PRIVATE",
    title: "Landing Page Storytelling Brand Kopi Lereng",
    problemSummary:
      "Brand kopi lokal belum memiliki etalase digital resmi untuk menjelaskan asal biji kopi dan paket gift set.",
    solutionSummary:
      "Mendesain dan mengimplementasikan landing page cepat dengan performa SEO tinggi dan visual estetik.",
    appliedSkillIds: ["React", "Next.js", "Tailwind CSS"],
    completedAt: "2026-08-22T09:00:00Z",
    stagingUrl: "https://kopi-lereng.preview.cocokin.test",
    verifiedByUmkm: true,
    displayOnly: true,
    ...SEED_METADATA,
  },
];

export function createSeededPortfolioEntries(): SeedPortfolioEntry[] {
  return cloneSeed(SEEDED_PORTFOLIO_ENTRIES);
}
