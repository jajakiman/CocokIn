export type AppRole = "talent" | "business" | "admin";
export type Density = "comfortable" | "standard" | "dense";

export type NavigationItem = {
  label: string;
  href: string;
};

export type RoleShellConfig = {
  role: AppRole;
  label: string;
  theme: "arctic-depths";
  shell: "adaptive-sidebar";
  density: Density;
  primaryAction: NavigationItem;
  navigation: NavigationItem[];
};

export const roleConfigs: Record<AppRole, RoleShellConfig> = {
  talent: {
    role: "talent",
    label: "Talent",
    theme: "arctic-depths",
    shell: "adaptive-sidebar",
    density: "comfortable",
    primaryAction: { label: "Cari proyek", href: "/talent/projects" },
    navigation: [
      { label: "Beranda", href: "/talent" },
      { label: "Asesmen", href: "/talent/assessment" },
      { label: "Cari Proyek", href: "/talent/projects" },
      { label: "Proyek Saya", href: "/talent/workspace" },
      { label: "Skill Passport", href: "/talent/passport" },
      { label: "Profil", href: "/talent/profile" },
    ],
  },
  business: {
    role: "business",
    label: "UMKM",
    theme: "arctic-depths",
    shell: "adaptive-sidebar",
    density: "standard",
    primaryAction: { label: "Buat proyek", href: "/business/projects/new" },
    navigation: [
      { label: "Beranda", href: "/business" },
      { label: "Proyek", href: "/business/projects" },
      { label: "Pelamar", href: "/business/applicants" },
      { label: "Pertumbuhan", href: "/business/growth" },
      { label: "Profil Usaha", href: "/business/profile" },
    ],
  },
  admin: {
    role: "admin",
    label: "Admin",
    theme: "arctic-depths",
    shell: "adaptive-sidebar",
    density: "dense",
    primaryAction: { label: "Tangani antrean", href: "/admin/verification" },
    navigation: [
      { label: "Ringkasan", href: "/admin" },
      { label: "Verifikasi", href: "/admin/verification" },
      { label: "Moderasi", href: "/admin/moderation" },
      { label: "Sengketa", href: "/admin/disputes" },
      { label: "Data Master", href: "/admin/taxonomy" },
    ],
  },
};

export function getRoleConfig(role: AppRole): RoleShellConfig {
  return roleConfigs[role];
}
