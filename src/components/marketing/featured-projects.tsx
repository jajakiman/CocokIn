"use client";

import Link from "next/link";
import { Clock, ArrowRight, ShieldCheck, Sparkle } from "@phosphor-icons/react";
import { motion } from "framer-motion";

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
    <section className="heyretro-section heyretro-section--alt" id="proyek-unggulan">
      <div className="heyretro-container">
        <motion.div
          className="section-header-centered"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="section-pill">
            <Sparkle size={14} weight="fill" />
            <span>Rekam Jejak Nyata</span>
          </div>
          <h2>Hasil Kerja Nyata yang Telah Tervalidasi</h2>
          <p>
            Proyek mikro berdurasi 3–14 hari yang diselesaikan talenta muda dan disahkan langsung oleh pelaku usaha UMKM.
          </p>
        </motion.div>

        <motion.div
          className="heyretro-projects-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {caseStudies.map((item) => (
            <motion.article
              key={item.id}
              className="heyretro-case-card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="case-card__top">
                <div className="case-card__badges">
                  <span className="case-cat-tag">{item.category}</span>
                  <span className="case-verified-tag">
                    <ShieldCheck size={14} weight="fill" /> Verified
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p className="case-client">Klien: <strong>{item.businessName}</strong></p>
                <p className="case-outcome">{item.outcome}</p>
              </div>

              <div className="case-card__bottom">
                <div className="case-skills">
                  {item.skills.map((s) => (
                    <span key={s} className="skill-chip">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="case-footer">
                  <span className="case-duration">
                    <Clock size={14} weight="bold" /> {item.duration}
                  </span>
                  <span className="case-milestones">{item.milestones}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="projects-bottom-cta">
          <Link href="/register/talent" className="text-action">
            Lihat semua peluang proyek <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
