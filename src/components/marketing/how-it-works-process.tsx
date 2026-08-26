import { Brain, Gauge, Kanban, SealCheck } from "@phosphor-icons/react/dist/ssr";

export function HowItWorksProcess() {
  const steps = [
    {
      order: "01",
      title: "Asesmen & Diagnosis",
      desc: "Talent mengikuti kuis kesiapan karier adaptif; UMKM mendiagnosis kebutuhan digital usaha.",
      icon: <Brain size={24} weight="duotone" />,
    },
    {
      order: "02",
      title: "Pencocokan Cerdas (Cocok Score)",
      desc: "Algoritma 5-faktor mempertemukan pelamar paling sesuai secara matematis dan transparan (0–100).",
      icon: <Gauge size={24} weight="duotone" />,
    },
    {
      order: "03",
      title: "Milestone & Staging Delivery",
      desc: "Pengerjaan 3–14 hari terbagi 1–4 tahapan. Deliverable diserahkan via tautan preview HTTPS.",
      icon: <Kanban size={24} weight="duotone" />,
    },
    {
      order: "04",
      title: "Verifikasi & Payout 90/10",
      desc: "UMKM menyetujui hasil. Talent menerima 90% payout langsung + 10% retensi garansi 30 hari & portofolio terbit.",
      icon: <SealCheck size={24} weight="duotone" />,
    },
  ];

  return (
    <section className="landing-section" id="cara-kerja">
      <div className="landing-section__container">
        <div className="section-header-editorial">
          <div>
            <p className="editorial-tag-pill">Alur Kerja Sistematis</p>
            <h2>Empat Tahap dari Kebutuhan hingga Pembuktian</h2>
            <p>
              Proses kolaborasi terstandar yang melindungi kedua pihak di setiap jengkal milestone.
            </p>
          </div>
        </div>

        <div className="process-steps-grid">
          {steps.map((s) => (
            <article key={s.order} className="process-step-card">
              <span className="process-step-num">Langkah {s.order}</span>
              <div style={{ color: "var(--primary)", marginBottom: "0.75rem" }}>
                {s.icon}
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
