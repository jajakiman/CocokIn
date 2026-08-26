"use client";

import type { ConsentSettings } from "@/src/context/talent-context";

type ConsentPanelProps = {
  consents: ConsentSettings;
  onChange: (updates: Partial<ConsentSettings>) => void;
  showRequiredWarning?: boolean;
};

export function ConsentPanel({
  consents,
  onChange,
  showRequiredWarning = false,
}: ConsentPanelProps) {
  return (
    <div className="consent-panel">
      <div className="consent-panel__header">
        <h3>Persetujuan & Privasi Data</h3>
        <p className="consent-panel__description">
          Sesuai prinsip etika data CocokIn, persetujuan layanan wajib dipisahkan dari persetujuan
          opsional portofolio dan riset.
        </p>
      </div>

      <div className="consent-list">
        {/* Required Terms */}
        <label className="consent-item consent-item--required">
          <input
            type="checkbox"
            id="consent-terms"
            checked={consents.termsAndPrivacy}
            onChange={(e) => onChange({ termsAndPrivacy: e.target.checked })}
          />
          <div>
            <strong>Syarat Layanan & Kebijakan Privasi (Wajib)</strong>
            <p>
              Saya menyetujui pemrosesan data profil untuk keperluan kalkulasi Cocok Score, penugasan
              proyek, dan komunikasi resmi platform.
            </p>
            {showRequiredWarning && !consents.termsAndPrivacy && (
              <span className="consent-item__error">
                Persetujuan ini wajib dicentang untuk melanjutkan.
              </span>
            )}
          </div>
        </label>

        {/* Optional Portfolio */}
        <label className="consent-item">
          <input
            type="checkbox"
            id="consent-portfolio"
            checked={consents.publicPortfolio}
            onChange={(e) => onChange({ publicPortfolio: e.target.checked })}
          />
          <div>
            <strong>Publikasi Portofolio Terverifikasi (Opsional)</strong>
            <p>
              Saya mengizinkan ringkasan proyek yang telah selesai dan disetujui UMKM untuk
              ditampilkan pada Paspor Keahlian Publik saya.
            </p>
          </div>
        </label>

        {/* Optional Marketing */}
        <label className="consent-item">
          <input
            type="checkbox"
            id="consent-marketing"
            checked={consents.marketingResearch}
            onChange={(e) => onChange({ marketingResearch: e.target.checked })}
          />
          <div>
            <strong>Riset Pengembangan & Informasi Peluang (Opsional)</strong>
            <p>
              Saya bersedia dihubungi untuk survei peningkatan platform dan rekomendasi program
              akselerasi karier.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
