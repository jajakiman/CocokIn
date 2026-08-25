"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AvailabilityType, WorkMode } from "@/src/modules/matching/types";
import { useTalent } from "@/src/context/talent-context";
import { getAllCareerIds, getCareerDomain } from "@/src/modules/talent/career-taxonomy";
import { StepProgress } from "@/src/design-system/step-progress";
import { ErrorSummary, type FormError } from "@/src/design-system/error-summary";
import { ConsentPanel } from "./consent-panel";

const STEPS = [
  { id: "identity", label: "Data Diri" },
  { id: "career", label: "Target Karier" },
  { id: "preference", label: "Preferensi Kerja" },
  { id: "consent", label: "Persetujuan" },
];

export function OnboardingForm() {
  const router = useRouter();
  const { profile, updateProfile, updateConsents } = useTalent();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<FormError[]>([]);

  const careerIds = getAllCareerIds();

  const validateStep = (): boolean => {
    const newErrors: FormError[] = [];

    if (currentStep === 0) {
      if (!profile.name.trim()) newErrors.push({ fieldId: "field-name", message: "Nama lengkap wajib diisi." });
      if (!profile.university.trim()) newErrors.push({ fieldId: "field-univ", message: "Asal universitas wajib diisi." });
      if (!profile.major.trim()) newErrors.push({ fieldId: "field-major", message: "Program studi / jurusan wajib diisi." });
    } else if (currentStep === 2) {
      if (!profile.city.trim()) newErrors.push({ fieldId: "field-city", message: "Kota domisili wajib diisi." });
    } else if (currentStep === 3) {
      if (!profile.consents.termsAndPrivacy) {
        newErrors.push({ fieldId: "consent-terms", message: "Anda wajib menyetujui Syarat Layanan & Kebijakan Privasi." });
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Selesai onboarding, arahkan ke asesmen
        router.push("/talent/assessment");
      }
    }
  };

  const handleBack = () => {
    setErrors([]);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="onboarding-container">
      <StepProgress steps={STEPS} currentStepIndex={currentStep} />
      <ErrorSummary errors={errors} />

      {/* Step 1: Data Diri */}
      {currentStep === 0 && (
        <div className="form-step">
          <h2>Informasi Data Diri & Akademik</h2>
          <p className="form-step__desc">Lengkapi identitasmu untuk verifikasi profil.</p>

          <div className="form-group">
            <label htmlFor="field-name">Nama Lengkap</label>
            <input
              id="field-name"
              type="text"
              className="form-input"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              placeholder="Contoh: Nadia Putri"
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="field-univ">Universitas / Institut</label>
              <input
                id="field-univ"
                type="text"
                className="form-input"
                value={profile.university}
                onChange={(e) => updateProfile({ university: e.target.value })}
                placeholder="Contoh: Institut Teknologi Bandung"
              />
            </div>
            <div className="form-group">
              <label htmlFor="field-major">Jurusan</label>
              <input
                id="field-major"
                type="text"
                className="form-input"
                value={profile.major}
                onChange={(e) => updateProfile({ major: e.target.value })}
                placeholder="Contoh: Teknik Informatika"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="field-bio">Bio Singkat</label>
            <textarea
              id="field-bio"
              className="form-textarea"
              rows={3}
              value={profile.bio}
              onChange={(e) => updateProfile({ bio: e.target.value })}
              placeholder="Ceritakan latar belakang dan ketertarikanmu..."
            />
          </div>
        </div>
      )}

      {/* Step 2: Target Karier */}
      {currentStep === 1 && (
        <div className="form-step">
          <h2>Pilih Target Jalur Karier</h2>
          <p className="form-step__desc">
            Pilihan ini akan menjadi acuan asesmen kesiapan karier dan rekomendasi proyek.
          </p>

          <div className="career-picker__grid">
            {careerIds.map((id) => {
              const career = getCareerDomain(id);
              const isSelected = profile.targetCareerId === id;

              return (
                <button
                  type="button"
                  key={id}
                  className="career-card"
                  data-selected={isSelected}
                  onClick={() => updateProfile({ targetCareerId: id })}
                >
                  <h3>{career.label}</h3>
                  <p className="career-card__skills">
                    {career.technicalSkills.length} technical skills • {career.softSkills.length} soft skills
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Preferensi Kerja */}
      {currentStep === 2 && (
        <div className="form-step">
          <h2>Preferensi Kerja & Ketersediaan</h2>
          <p className="form-step__desc">
            Tentukan sistem kerja dan ketersediaan waktu untuk kalkulasi Cocok Score.
          </p>

          <div className="form-group">
            <label>Mode Kerja yang Diinginkan</label>
            <div className="radio-pill-group">
              {(["REMOTE", "HYBRID", "ONSITE"] as WorkMode[]).map((mode) => (
                <label key={mode} className="radio-pill" data-checked={profile.workModePreference === mode}>
                  <input
                    type="radio"
                    name="workMode"
                    value={mode}
                    checked={profile.workModePreference === mode}
                    onChange={() => updateProfile({ workModePreference: mode })}
                  />
                  <span>{mode === "REMOTE" ? "Remote (Jarak Jauh)" : mode === "HYBRID" ? "Hybrid (Sebagian Onsite)" : "Onsite (Di Lokasi)"}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Ketersediaan Waktu Pengerjaan</label>
            <div className="radio-pill-group">
              {(["FULL_TIME", "PART_TIME", "WEEKEND"] as AvailabilityType[]).map((avail) => (
                <label key={avail} className="radio-pill" data-checked={profile.availability === avail}>
                  <input
                    type="radio"
                    name="availability"
                    value={avail}
                    checked={profile.availability === avail}
                    onChange={() => updateProfile({ availability: avail })}
                  />
                  <span>{avail === "FULL_TIME" ? "Full Time" : avail === "PART_TIME" ? "Part Time (Senggang)" : "Weekend Only"}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="field-city">Kota Domisili</label>
            <input
              id="field-city"
              type="text"
              className="form-input"
              value={profile.city}
              onChange={(e) => updateProfile({ city: e.target.value })}
              placeholder="Contoh: Bandung, Jakarta, Surabaya"
            />
          </div>
        </div>
      )}

      {/* Step 4: Persetujuan Etis */}
      {currentStep === 3 && (
        <div className="form-step">
          <h2>Persetujuan & Kebijakan Data</h2>
          <ConsentPanel
            consents={profile.consents}
            onChange={updateConsents}
            showRequiredWarning={Boolean(errors.find((e) => e.fieldId === "consent-terms"))}
          />
        </div>
      )}

      {/* Navigasi Alur Wizard */}
      <div className="form-actions">
        {currentStep > 0 && (
          <button type="button" className="secondary-action" onClick={handleBack}>
            Kembali
          </button>
        )}
        <button type="button" className="primary-action" onClick={handleNext}>
          {currentStep === STEPS.length - 1 ? "Selesaikan & Mulai Asesmen" : "Lanjutkan"}
        </button>
      </div>
    </div>
  );
}
