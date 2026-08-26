import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer__container">
        <div className="public-footer__grid">
          {/* Col 1: Brand & Tagline */}
          <div className="public-footer__brand-col">
            <Link className="public-brand public-brand--footer" href="/">
              <span className="brand-dot" aria-hidden="true" />
              <strong>CocokIn</strong>
            </Link>
            <p className="public-footer__desc">
              CocokIn menghubungkan talenta muda dengan kebutuhan digital UMKM melalui proyek yang
              terarah, mudah dipantau, dan memiliki perlindungan hasil kerja.
            </p>
            <p className="public-footer__platform-note">
              <ShieldCheck aria-hidden="true" size={18} />
              <span>Platform Resmi Penyelarasan SDG 8 & 9 Indonesia</span>
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <nav className="public-footer__nav-col" aria-label="Navigasi footer">
            <h4>Navigasi</h4>
            <ul>
              <li><Link href="#proyek-unggulan">Proyek Nyata</Link></li>
              <li><Link href="#alur-kebutuhan">Pilihan Jalur</Link></li>
              <li><Link href="#cara-kerja">Cara Kerja</Link></li>
              <li><Link href="#product-proof">Bukti Produk</Link></li>
              <li><Link href="#trust">Keamanan & Garansi</Link></li>
            </ul>
          </nav>

          {/* Col 3: Akses Akun & Portofolio */}
          <div className="public-footer__nav-col">
            <h4>Akses Platform</h4>
            <ul>
              <li><Link href="/login">Masuk ke Akun</Link></li>
              <li><Link href="/register/talent">Pendaftaran Talent</Link></li>
              <li><Link href="/register/business">Pendaftaran UMKM</Link></li>
              <li><Link href="/p/talent-nadia">Contoh Paspor Digital</Link></li>
            </ul>
          </div>
        </div>

        <div className="public-footer__bottom">
          <p>© 2026 CocokIn Ecosystem. Hak cipta dilindungi undang-undang.</p>
          <div className="public-footer__legal-badges">
            <span>Dana Proyek Terlindungi</span>
            <span>Garansi 30 Hari</span>
            <span>Atribusi Terverifikasi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
