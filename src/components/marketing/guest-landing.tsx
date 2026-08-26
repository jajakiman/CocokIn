import {
  ArrowRight,
  CheckCircle,
  Coins,
  Fingerprint,
  FlowArrow,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { PublicFooter } from "@/src/components/public/public-footer";
import { PublicHeader } from "@/src/components/public/public-header";

import { ProductProof } from "./product-proof";
import { RolePath } from "./role-path";

const process = ["Skill", "Assessment", "Cocok Score", "Micro-project", "Verification"];

export function GuestLanding() {
  return (
    <>
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <PublicHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="landing-hero" id="hero">
          <div className="landing-hero__inner">
            <div className="landing-hero__copy">
              <p className="landing-eyebrow">Talent bertumbuh · UMKM naik kelas</p>
              <h1>Proyek digital yang mempertemukan potensi dan kebutuhan nyata.</h1>
              <p className="landing-hero__lead">
                CocokIn membantu Talent membangun bukti kerja dan UMKM menyelesaikan kebutuhan
                digital melalui proses yang terukur dari matching hingga verifikasi.
              </p>
              <div className="landing-actions landing-actions--primary">
                <Link className="landing-button landing-button--primary" href="/register/talent">
                  Mulai sebagai Talent
                </Link>
                <Link className="landing-button landing-button--primary" href="/register/business">
                  Mulai sebagai UMKM
                </Link>
              </div>
              <Link className="landing-demo-link" href="/demo">
                Lihat demo sistem
                <ArrowRight aria-hidden="true" size={20} />
              </Link>
              <p className="landing-hero__note">Demo sistem menggunakan data sintetis.</p>
            </div>

            <div aria-label="Alur nilai CocokIn" className="landing-hero__visual">
              <div className="landing-hero__signal landing-hero__signal--talent">
                <span>Potensi Talent</span>
                <strong>Skill + kesiapan</strong>
              </div>
              <div className="landing-hero__match">
                <FlowArrow aria-hidden="true" size={32} />
                <span>Cocok Score</span>
                <strong>Terukur</strong>
              </div>
              <div className="landing-hero__signal landing-hero__signal--business">
                <span>Kebutuhan UMKM</span>
                <strong>Masalah + outcome</strong>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="role-paths-title"
          className="landing-section landing-role-paths"
          id="problem-outcome"
        >
          <div className="landing-section__heading">
            <p className="landing-eyebrow">Dari hambatan menuju hasil</p>
            <h2 id="role-paths-title">Satu alur, nilai yang jelas bagi kedua sisi.</h2>
          </div>
          <div className="landing-role-paths__list">
            <div id="untuk-talent"><RolePath audience="talent" /></div>
            <div id="untuk-umkm"><RolePath audience="umkm" /></div>
          </div>
        </section>

        <section aria-labelledby="process-title" className="landing-section landing-process" id="cara-kerja">
          <div className="landing-section__heading">
            <p className="landing-eyebrow">Cara CocokIn bekerja</p>
            <h2 id="process-title">Dari skill sampai bukti terverifikasi.</h2>
          </div>
          <ol className="landing-process__steps">
            {process.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
        </section>

        <ProductProof />

        <section aria-labelledby="trust-title" className="landing-section landing-trust" id="trust">
          <div className="landing-trust__intro">
            <p className="landing-eyebrow">Trust dibangun dari batas yang jelas</p>
            <h2 id="trust-title">Transparan tentang apa yang sistem lakukan.</h2>
          </div>
          <ul className="landing-trust__list">
            <li><Fingerprint aria-hidden="true" size={24} /><span>Cocok Score dihitung secara deterministik dari faktor yang dapat dijelaskan.</span></li>
            <li><CheckCircle aria-hidden="true" size={24} /><span>Publikasi portofolio memerlukan persetujuan publikasi Talent dan persetujuan atribusi UMKM.</span></li>
            <li><ShieldCheck aria-hidden="true" size={24} /><span>Data demonstrasi seluruhnya sintetis dan tidak mewakili pengguna nyata.</span></li>
            <li><Coins aria-hidden="true" size={24} /><span>Operasi uang nyata tetap dinonaktifkan sampai seluruh gate legal dan operasional terpenuhi.</span></li>
          </ul>
        </section>

        <section
          aria-labelledby="final-cta-title"
          className="landing-section landing-final-cta"
          id="final-cta"
        >
          <div>
            <p className="landing-eyebrow">Pilih jalur Anda</p>
            <h2 id="final-cta-title">Mulai dari potensi atau kebutuhan yang nyata.</h2>
          </div>
          <div className="landing-actions">
            <Link className="landing-button landing-button--primary" href="/register/talent">Mulai sebagai Talent</Link>
            <Link className="landing-button landing-button--primary" href="/register/business">Mulai sebagai UMKM</Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
