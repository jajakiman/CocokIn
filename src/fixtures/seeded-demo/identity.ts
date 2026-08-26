import {
  cloneSeed,
  SEED_METADATA,
  type SeededRecord,
  type SeedIdentity,
} from "./types";
import type { AppRole } from "@/src/design-system/role-config";
import type { StatusTone } from "@/src/design-system/status-badge";

export const SEEDED_TALENT_IDENTITY: SeededRecord<SeedIdentity> = {
  id: "identity-talent-nadia",
  role: "TALENT",
  displayName: "Nadia Putri",
  email: "nadia.talent@demo.cocokin.test",
  ...SEED_METADATA,
};

export const SEEDED_BUSINESS_IDENTITY: SeededRecord<SeedIdentity> = {
  id: "identity-business-warung-siti",
  role: "BUSINESS",
  displayName: "Siti Rahma",
  email: "siti.business@demo.cocokin.test",
  ...SEED_METADATA,
};

const SEEDED_IDENTITIES = [SEEDED_TALENT_IDENTITY, SEEDED_BUSINESS_IDENTITY] as const;

export function createSeededIdentities(): SeededRecord<SeedIdentity>[] {
  return cloneSeed([...SEEDED_IDENTITIES]);
}

export type DashboardFixture = {
  eyebrow: string;
  title: string;
  description: string;
  sectionTitle: string;
  metrics: Array<{ label: string; value: string; detail: string }>;
  tasks: Array<{ title: string; meta: string; status: string; tone: StatusTone }>;
};

export const SEEDED_DASHBOARD_FIXTURES: Record<AppRole, DashboardFixture> = {
  talent: {
    eyebrow: "Ruang berkembang",
    title: "Selamat datang, Nadia",
    description: "Lanjutkan proyek aktif dan tutup skill gap menuju Frontend Developer.",
    sectionTitle: "Rekomendasi untukmu",
    metrics: [
      { label: "Proyek aktif", value: "1", detail: "Milestone 2 dari 3" },
      { label: "Kesiapan karier", value: "72/100", detail: "+6 dari asesmen terakhir" },
      { label: "Skill terverifikasi", value: "4", detail: "2 skill baru dari proyek" },
    ],
    tasks: [
      { title: "Website katalog Warung Bu Siti", meta: "Cocok Score 87 · 8 hari", status: "Sangat cocok", tone: "success" },
      { title: "Landing page Kopi Lereng", meta: "Cocok Score 78 · 5 hari", status: "Direkomendasikan", tone: "info" },
    ],
  },
  business: {
    eyebrow: "Kontrol proyek",
    title: "Warung Bu Siti",
    description: "Tinjau pekerjaan yang menunggu keputusan dan pantau progres digital usaha.",
    sectionTitle: "Proyek berjalan",
    metrics: [
      { label: "Menunggu review", value: "1", detail: "Batas review 18 jam" },
      { label: "Proyek aktif", value: "2", detail: "Satu menuju handover" },
      { label: "Kesiapan digital", value: "58/100", detail: "+11 setelah proyek pertama" },
    ],
    tasks: [
      { title: "Katalog dan pemesanan WhatsApp", meta: "Milestone implementasi dikirim", status: "Perlu review", tone: "warning" },
      { title: "Pencatatan stok sederhana", meta: "Pengerjaan hari ke-3", status: "Berjalan", tone: "info" },
    ],
  },
  admin: {
    eyebrow: "Operasi platform",
    title: "Ringkasan hari ini",
    description: "Dahulukan antrean berisiko, rekonsiliasi, dan kasus yang melewati SLA.",
    sectionTitle: "Antrean verifikasi",
    metrics: [
      { label: "SLA terlewati", value: "1", detail: "Tiket warranty kritis" },
      { label: "Sengketa terbuka", value: "3", detail: "Satu menunggu bukti" },
      { label: "Coverage reserve", value: "100%", detail: "Mode simulasi aktif" },
    ],
    tasks: [
      { title: "Verifikasi UMKM Dapur Rasa", meta: "Dokumen diperbarui 12 menit lalu", status: "Perlu tindakan", tone: "warning" },
      { title: "Funding CCK-1042-FUND-01", meta: "Nominal dan bukti belum cocok", status: "Unmatched", tone: "destructive" },
    ],
  },
};
