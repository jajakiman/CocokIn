import Link from "next/link";
import { Clock, ArrowRight, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

export function FeaturedProjects() {
  const caseStudies = [
    {
      id: "case-01",
      title: "Website Katalog & Pemesanan WhatsApp",
      businessName: "Warung Bu Siti",
      category: "Frontend Development",
      duration: "8 Hari Pengerjaan",
      milestones: "3 Milestone Tuntas",
      outcome: "Katalog menu digital responsif dengan tombol pesan otomatis ke WhatsApp penjual.",
      skills: ["React", "Next.js", "Tailwind CSS", "WhatsApp API"],
      verified: true,
    },
    {
      id: "case-02",
      title: "Landing Page & Brand Storytelling Kopi Lokal",
      businessName: "Kopi Lereng Manglayang",
      category: "Web & Digital Marketing",
      duration: "5 Hari Pengerjaan",
      milestones: "2 Milestone Tuntas",
      outcome: "Etalase digital resmi bercerita tentang asal biji kopi dan paket bundling gift set UMKM.",
      skills: ["Next.js", "Tailwind CSS", "SEO", "Copywriting"],
      verified: true,
    },
    {
      id: "case-03",
      title: "Redesign Alur Reservasi & Antrean Laundry",
      businessName: "LaundryKu",
      category: "UI/UX Design",
      duration: "10 Hari Pengerjaan",
      milestones: "4 Milestone Tuntas",
      outcome: "Prototipe interaktif Figma alur tracking status cucian kiloan berbasis nomor nota.",
      skills: ["Figma", "User Research", "Wireframing", "Prototyping"],
      verified: true,
    },
  ];

  return (
    <section className="landing-section" id="proyek-unggulan">
      <div className="landing-section__container">
        <div className="section-header-editorial">
          <div>
            <p className="editorial-tag-pill" style={{ color: "var(--success)" }}>
              Rekam Jejak Nyata
            </p>
            <h2>Hasil Kerja Nyata yang Telah Tervalidasi</h2>
            <p>
              Proyek mikro berdurasi 3–14 hari yang diselesaikan talenta muda dan disahkan langsung oleh pelaku usaha UMKM.
            </p>
          </div>
          <Link href="/register/talent" className="text-action" style={{ fontSize: "0.95rem" }}>
            Lihat semua peluang proyek <ArrowRight size={16} weight="bold" />
          </Link>
        </div>

        <div className="featured-projects-grid">
          {caseStudies.map((item) => (
            <article key={item.id} className="project-case-card">
              <div>
                <div className="project-case-card__header">
                  <div className="project-case-card__tags">
                    <span className="status-badge" data-tone="info">
                      {item.category}
                    </span>
                    <span className="status-badge" data-tone="success">
                      <ShieldCheck size={14} weight="fill" /> Verified
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="project-case-card__biz">Klien: {item.businessName}</p>
                </div>

                <p className="project-case-card__summary">{item.outcome}</p>

                <div className="portfolio-skills" style={{ marginBottom: "1.25rem" }}>
                  {item.skills.map((s) => (
                    <span key={s} className="skill-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="project-case-card__footer">
                <span style={{ color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Clock size={14} weight="bold" /> {item.duration}
                </span>
                <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                  {item.milestones}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
