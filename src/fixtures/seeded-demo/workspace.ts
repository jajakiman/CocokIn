import { cloneSeed, SEED_METADATA, type SeededRecord, type SeedWorkspace } from "./types";

export const SEEDED_WORKSPACE: SeededRecord<SeedWorkspace> = {
  id: "prj-act-01",
  title: "Website Katalog & WhatsApp Warung Bu Siti",
  businessId: "business-warung-siti",
  businessName: "Warung Bu Siti",
  serviceValue: 1500000,
  status: "IN_PROGRESS",
  durationDays: 8,
  remainingDays: 3,
  milestones: [
    {
      id: "m-1",
      order: 1,
      title: "Desain UI & Struktur Menu Katalog",
      weight: 30,
      status: "APPROVED",
      deliverableSummary: "Wireframe & prototipe Figma tervalidasi pemilik warung.",
      submittedUrl: "https://figma.example.test/warung-bu-siti",
    },
    {
      id: "m-2",
      order: 2,
      title: "Implementasi Halaman Katalog & Filter Kategori",
      weight: 40,
      status: "READY_FOR_REVIEW",
      deliverableSummary: "Katalog responsif live dengan tombol WhatsApp.",
      submittedUrl: "https://milestone-2.preview.cocokin.test",
    },
    {
      id: "m-3",
      order: 3,
      title: "Deploy Production & Serah Terima Handover",
      weight: 30,
      status: "PENDING",
      deliverableSummary: "Deployment ke domain utama dan dokumentasi penggunaan.",
    },
  ],
  ...SEED_METADATA,
};

export function createSeededWorkspace(): SeededRecord<SeedWorkspace> {
  return cloneSeed(SEEDED_WORKSPACE);
}
