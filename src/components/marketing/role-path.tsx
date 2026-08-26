import { ArrowRight, Briefcase, Storefront } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

type RolePathProps = {
  audience: "talent" | "umkm";
};

const paths = {
  talent: {
    eyebrow: "Untuk Talent",
    title: "Ubah skill menjadi bukti kerja yang bisa dijelaskan.",
    description:
      "Ukur kesiapan, temukan proyek mikro yang relevan, lalu bangun Passport dan portofolio dari hasil yang diverifikasi.",
    href: "/register/talent",
    label: "Pelajari jalur Talent",
    Icon: Briefcase,
  },
  umkm: {
    eyebrow: "Untuk UMKM",
    title: "Ubah masalah digital menjadi proyek yang terukur.",
    description:
      "Susun kebutuhan dalam bahasa bisnis, pilih Talent berdasarkan kecocokan yang transparan, dan tinjau hasil per milestone.",
    href: "/register/business",
    label: "Pelajari jalur UMKM",
    Icon: Storefront,
  },
} as const;

export function RolePath({ audience }: RolePathProps) {
  const path = paths[audience];

  return (
    <article className={`landing-role landing-role--${audience}`}>
      <path.Icon aria-hidden="true" className="landing-role__icon" size={28} />
      <div>
        <p className="landing-eyebrow">{path.eyebrow}</p>
        <h3>{path.title}</h3>
        <p>{path.description}</p>
      </div>
      <Link className="landing-text-link" href={path.href}>
        {path.label}
        <ArrowRight aria-hidden="true" size={20} />
      </Link>
    </article>
  );
}
