"use client";

import { ArrowRight, Sparkle, UserCheck } from "@phosphor-icons/react";
import { useState } from "react";
import { motion } from "framer-motion";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/design-system/select";
import { CocokInBrand } from "@/src/design-system/cocokin-brand";

const CAREER_ROLES = [
  { id: "Fullstack Developer", label: "Fullstack Developer", desc: "Website & API end-to-end: React/Next.js, Node.js, database, deployment" },
  { id: "UI/UX Designer", label: "UI/UX Designer", desc: "Riset pengguna, wireframe, Figma design system" },
  { id: "Data Analyst", label: "Data Analyst", desc: "Pengolahan database, SQL, spreadsheet & visualisasi data" },
  { id: "Digital Marketer", label: "Digital Marketer", desc: "Strategi konten, SEO, Meta Ads & analitik pemasaran" },
] as const;

export function TalentOnboardingWizard({ initialName }: { initialName: string }) {
  const names = initialName.trim().split(/\s+/);
  const [firstName, setFirstName] = useState(names[0] ?? "");
  const [lastName, setLastName] = useState(names.slice(1).join(" "));
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [careerTarget, setCareerTarget] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [hasNoPortfolio, setHasNoPortfolio] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#D8E1EE] bg-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,16,64,0.18)]"
    >
      <div className="flex items-center justify-between pb-5 border-b border-[#D8E1EE]">
        <div className="flex items-center gap-2.5">
          <CocokInBrand className="h-7 w-7 object-contain" decorative priority variant="mark" />
          <div>
            <h2 className="text-lg font-bold text-[#001040] leading-tight flex items-center gap-1.5">
              Lengkapi Profil Awal
              <Sparkle className="text-[#FF8010]" size={16} weight="fill" />
            </h2>
            <p className="text-xs text-[#53647A]">Langkah satu kali untuk membuka akses dashboard & proyek.</p>
          </div>
        </div>
        <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF3FF] text-[#006FE6]">
          <UserCheck size={18} weight="bold" />
        </div>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(undefined);

          if (!firstName.trim() || !lastName.trim()) {
            setError("Nama depan dan nama belakang wajib diisi.");
            return;
          }
          if (!university.trim()) {
            setError("Universitas atau institusi wajib diisi.");
            return;
          }
          if (!major.trim()) {
            setError("Jurusan atau bidang studi wajib diisi.");
            return;
          }
          if (!careerTarget) {
            setError("Target karier wajib dipilih.");
            return;
          }
          if (!hasNoPortfolio && !portfolioUrl.trim()) {
            setError("Tambahkan tautan portofolio atau centang opsi belum memiliki portofolio.");
            return;
          }

          setPending(true);
          try {
            const response = await fetch("/api/talent/onboarding", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                firstName,
                lastName,
                university,
                major,
                careerTarget,
                portfolioUrl,
                hasNoPortfolio,
              }),
            });
            if (!response.ok) {
              const result = await response.json().catch(() => ({ message: "Data onboarding tidak dapat disimpan." }));
              setError(result.message);
              setPending(false);
              return;
            }
            window.location.assign("/talent");
          } catch {
            setError("Terjadi kendala jaringan. Silakan coba lagi.");
            setPending(false);
          }
        }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RequiredField label="Nama Depan" htmlFor="firstName">
            <input
              className="w-full rounded-xl border border-[#D8E1EE] bg-[#F7F9FC] px-3.5 py-2 text-sm text-[#001040] placeholder:text-[#53647A]/60 focus:bg-white focus:border-[#006FE6] focus:outline-none focus:ring-2 focus:ring-[#006FE6]/20 transition-all"
              id="firstName"
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Contoh: Nadia"
              required
              value={firstName}
            />
          </RequiredField>
          <RequiredField label="Nama Belakang" htmlFor="lastName">
            <input
              className="w-full rounded-xl border border-[#D8E1EE] bg-[#F7F9FC] px-3.5 py-2 text-sm text-[#001040] placeholder:text-[#53647A]/60 focus:bg-white focus:border-[#006FE6] focus:outline-none focus:ring-2 focus:ring-[#006FE6]/20 transition-all"
              id="lastName"
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Contoh: Arina"
              required
              value={lastName}
            />
          </RequiredField>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RequiredField label="Universitas / Institusi" htmlFor="university">
            <input
              className="w-full rounded-xl border border-[#D8E1EE] bg-[#F7F9FC] px-3.5 py-2 text-sm text-[#001040] placeholder:text-[#53647A]/60 focus:bg-white focus:border-[#006FE6] focus:outline-none focus:ring-2 focus:ring-[#006FE6]/20 transition-all"
              id="university"
              name="university"
              onChange={(event) => setUniversity(event.target.value)}
              placeholder="Contoh: Telkom University"
              required
              value={university}
            />
          </RequiredField>

          <RequiredField label="Jurusan / Program Studi" htmlFor="major">
            <input
              className="w-full rounded-xl border border-[#D8E1EE] bg-[#F7F9FC] px-3.5 py-2 text-sm text-[#001040] placeholder:text-[#53647A]/60 focus:bg-white focus:border-[#006FE6] focus:outline-none focus:ring-2 focus:ring-[#006FE6]/20 transition-all"
              id="major"
              name="major"
              onChange={(event) => setMajor(event.target.value)}
              placeholder="Contoh: Sistem Informasi"
              required
              value={major}
            />
          </RequiredField>
        </div>

        <RequiredField label="Target Jalur Karier" htmlFor="careerTarget">
          <Select onValueChange={setCareerTarget} value={careerTarget}>
            <SelectTrigger id="careerTarget">
              <SelectValue placeholder="Pilih fokus profesi digital" />
            </SelectTrigger>
            <SelectContent>
              {CAREER_ROLES.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  <div className="flex flex-col text-left py-0.5">
                    <span className="font-semibold text-[#001040] text-sm">{role.label}</span>
                    <span className="text-[11px] text-[#53647A] leading-tight">{role.desc}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </RequiredField>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#001040]" htmlFor="portfolioUrl">
              Tautan Portofolio / GitHub / LinkedIn
            </label>
            <span className="text-[11px] text-[#53647A]">Opsional</span>
          </div>
          <input
            className="w-full rounded-xl border border-[#D8E1EE] bg-[#F7F9FC] px-3.5 py-2 text-sm text-[#001040] placeholder:text-[#53647A]/60 focus:bg-white focus:border-[#006FE6] focus:outline-none focus:ring-2 focus:ring-[#006FE6]/20 disabled:opacity-50 disabled:bg-[#EEF2F6] transition-all"
            disabled={hasNoPortfolio}
            id="portfolioUrl"
            onChange={(event) => setPortfolioUrl(event.target.value)}
            placeholder="https://github.com/username atau linkedin.com/in/..."
            type="url"
            value={portfolioUrl}
          />
          <label className="flex items-center gap-2 text-xs text-[#53647A] cursor-pointer pt-0.5">
            <input
              checked={hasNoPortfolio}
              className="h-3.5 w-3.5 rounded border-[#D8E1EE] text-[#006FE6] focus:ring-[#006FE6]"
              onChange={(event) => {
                setHasNoPortfolio(event.target.checked);
                if (event.target.checked) setPortfolioUrl("");
              }}
              type="checkbox"
            />
            Saya belum memiliki tautan portofolio eksternal saat ini.
          </label>
        </div>

        {error ? (
          <div className="rounded-xl border border-[#FDA4AF] bg-[#FFF1F2] p-3 text-xs font-medium text-[#BE123C]" role="alert">
            {error}
          </div>
        ) : null}

        <div className="pt-3">
          <button
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#001040] py-3 px-5 text-sm font-bold text-white shadow-md shadow-[#001040]/10 hover:bg-[#001040]/90 active:scale-[0.99] disabled:opacity-50 transition-all"
            disabled={pending}
            type="submit"
          >
            {pending ? "Menyimpan Profil..." : "Buka Dashboard Talent"}
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function RequiredField({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-xs font-bold text-[#001040] block" htmlFor={htmlFor}>
        {label} <span className="text-[#E11D48] ml-0.5" aria-hidden="true">*</span>
      </label>
      {children}
    </div>
  );
}
