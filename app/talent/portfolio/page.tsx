import { AppShell } from "@/src/design-system/app-shell";
import { PortfolioView } from "@/src/components/talent/portfolio-view";
import type { PortfolioEntry } from "@/src/modules/portfolio/types";

export default function TalentPortfolioPage() {
  const mockPortfolios: PortfolioEntry[] = [
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
      stagingUrl: "https://warungbusiti.preview.cocokin.id",
      verifiedByUmkm: true,
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
      stagingUrl: "https://kopilereng.preview.cocokin.id",
      verifiedByUmkm: true,
    },
  ];

  return (
    <AppShell role="talent">
      <PortfolioView initialEntries={mockPortfolios} />
    </AppShell>
  );
}
