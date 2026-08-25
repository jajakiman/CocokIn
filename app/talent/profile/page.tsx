"use client";

import { useState } from "react";
import { AppShell } from "@/src/design-system/app-shell";
import { PageHeader } from "@/src/design-system/page-header";
import { useTalent } from "@/src/context/talent-context";
import { ConsentPanel } from "@/src/components/talent/consent-panel";
import { getAllCareerIds, getCareerDomain } from "@/src/modules/talent/career-taxonomy";
import type { AvailabilityType, WorkMode } from "@/src/modules/matching/types";
import type { CareerDomainId } from "@/src/modules/talent/types";

export default function TalentProfilePage() {
  const { profile, updateProfile, updateConsents } = useTalent();
  const [savedToast, setSavedToast] = useState(false);
  const careerIds = getAllCareerIds();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <AppShell role="talent">
      <form onSubmit={handleSave} className="profile-form-container">
        <PageHeader
          eyebrow="Kelola Akun"
          title="Profil & Preferensi Karier"
          description="Sesuaikan preferensi kerja dan data diri untuk mendapatkan rekomendasi proyek yang paling cocok."
          action={
            <button type="submit" className="primary-action">
              Simpan Perubahan
            </button>
          }
        />

        {savedToast && (
          <div role="status" className="status-toast status-toast--success">
            ✓ Profil dan preferensi berhasil diperbarui!
          </div>
        )}

        <div className="profile-sections">
          {/* Data Akademik */}
          <section className="content-section form-section">
            <div className="section-heading">
              <h2>Informasi Akademik & Bio</h2>
            </div>
            <div className="form-body">
              <div className="form-group">
                <label htmlFor="p-name">Nama Lengkap</label>
                <input
                  id="p-name"
                  type="text"
                  className="form-input"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="p-univ">Universitas</label>
                  <input
                    id="p-univ"
                    type="text"
                    className="form-input"
                    value={profile.university}
                    onChange={(e) => updateProfile({ university: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="p-major">Jurusan</label>
                  <input
                    id="p-major"
                    type="text"
                    className="form-input"
                    value={profile.major}
                    onChange={(e) => updateProfile({ major: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="p-bio">Bio Ringkas</label>
                <textarea
                  id="p-bio"
                  rows={3}
                  className="form-textarea"
                  value={profile.bio}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Target Karier & Preferensi */}
          <section className="content-section form-section">
            <div className="section-heading">
              <h2>Target Karier & Sistem Kerja</h2>
            </div>
            <div className="form-body">
              <div className="form-group">
                <label htmlFor="p-career">Target Jalur Profesi</label>
                <select
                  id="p-career"
                  className="form-select"
                  value={profile.targetCareerId}
                  onChange={(e) => updateProfile({ targetCareerId: e.target.value as CareerDomainId })}
                >
                  {careerIds.map((id) => (
                    <option key={id} value={id}>
                      {getCareerDomain(id).label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="p-mode">Preferensi Mode Kerja</label>
                  <select
                    id="p-mode"
                    className="form-select"
                    value={profile.workModePreference}
                    onChange={(e) => updateProfile({ workModePreference: e.target.value as WorkMode })}
                  >
                    <option value="REMOTE">Remote (Jarak Jauh)</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONSITE">Onsite (Di Lokasi)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="p-avail">Ketersediaan Waktu</label>
                  <select
                    id="p-avail"
                    className="form-select"
                    value={profile.availability}
                    onChange={(e) => updateProfile({ availability: e.target.value as AvailabilityType })}
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="WEEKEND">Weekend Only</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="p-city">Kota Domisili</label>
                <input
                  id="p-city"
                  type="text"
                  className="form-input"
                  value={profile.city}
                  onChange={(e) => updateProfile({ city: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Consent Settings */}
          <section className="content-section form-section">
            <div className="section-heading">
              <h2>Pengaturan Izin & Privasi Data</h2>
            </div>
            <div className="form-body">
              <ConsentPanel
                consents={profile.consents}
                onChange={updateConsents}
              />
            </div>
          </section>
        </div>
      </form>
    </AppShell>
  );
}
