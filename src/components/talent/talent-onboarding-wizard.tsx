"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/design-system/select";
import { onboardingSkills } from "@/src/modules/talent/onboarding";

const suggestedSkills = [...onboardingSkills];

export function TalentOnboardingWizard({ initialName }: { initialName: string }) {
  const router = useRouter();
  const names = initialName.trim().split(/\s+/);
  const [firstName, setFirstName] = useState(names[0] ?? "");
  const [lastName, setLastName] = useState(names.slice(1).join(" "));
  const [careerTarget, setCareerTarget] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [hasNoPortfolio, setHasNoPortfolio] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const toggleSkill = (skill: string) => {
    setSkills((current) => current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]);
  };

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError(undefined);
        const data = new FormData(event.currentTarget);
        const response = await fetch("/api/talent/onboarding", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            university: data.get("university"),
            major: data.get("major"),
            careerTarget,
            portfolioUrl,
            hasNoPortfolio,
            skills,
          }),
        });
        if (!response.ok) {
          const result = await response.json().catch(() => ({ message: "Data onboarding tidak dapat disimpan." }));
          setError(result.message);
          setPending(false);
          return;
        }
        router.push("/talent");
        router.refresh();
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RequiredField label="Nama depan" htmlFor="firstName">
          <input className="onboarding-input" id="firstName" onChange={(event) => setFirstName(event.target.value)} required value={firstName} />
        </RequiredField>
        <RequiredField label="Nama belakang" htmlFor="lastName">
          <input className="onboarding-input" id="lastName" onChange={(event) => setLastName(event.target.value)} required value={lastName} />
        </RequiredField>
      </div>

      <RequiredField label="Universitas atau institusi" htmlFor="university">
        <input className="onboarding-input" id="university" name="university" placeholder="Contoh: Universitas Indonesia" required />
      </RequiredField>

      <RequiredField label="Jurusan atau bidang studi" htmlFor="major">
        <input className="onboarding-input" id="major" name="major" placeholder="Contoh: Sistem Informasi" required />
      </RequiredField>

      <RequiredField label="Target karier" htmlFor="careerTarget">
        <Select onValueChange={setCareerTarget} value={careerTarget}>
          <SelectTrigger id="careerTarget"><SelectValue placeholder="Pilih target karier" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
            <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
            <SelectItem value="Data Analyst">Data Analyst</SelectItem>
            <SelectItem value="Digital Marketer">Digital Marketer</SelectItem>
          </SelectContent>
        </Select>
      </RequiredField>

      <RequiredField label="Portofolio, GitHub, atau LinkedIn" htmlFor="portfolioUrl">
        <input
          className="onboarding-input"
          disabled={hasNoPortfolio}
          id="portfolioUrl"
          onChange={(event) => setPortfolioUrl(event.target.value)}
          placeholder="https://github.com/username"
          type="url"
          value={portfolioUrl}
        />
      </RequiredField>
      <label className="flex items-center gap-2 text-sm text-[#53647A]">
        <input
          checked={hasNoPortfolio}
          onChange={(event) => {
            setHasNoPortfolio(event.target.checked);
            if (event.target.checked) setPortfolioUrl("");
          }}
          type="checkbox"
        />
        Saya belum memiliki tautan portofolio eksternal.
      </label>

      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-[#001040]">Keahlian utama <span className="text-[#E11D48]">*</span></legend>
        <div className="flex flex-wrap gap-2">
          {suggestedSkills.map((skill) => (
            <button
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${skills.includes(skill) ? "border-[#006FE6] bg-[#EAF3FF] text-[#006FE6]" : "border-[#D8E1EE] bg-white text-[#53647A] hover:border-[#9AABC2]"}`}
              key={skill}
              onClick={() => toggleSkill(skill)}
              type="button"
            >
              {skill}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="rounded-xl border border-[#D8E1EE] bg-[#F8FAFC] p-4 text-xs leading-relaxed text-[#53647A]">
        Seluruh proyek CocokIn mendukung kolaborasi digital. Anda tetap menentukan sendiri proyek yang ingin dilamar atau diterima.
      </div>

      {error ? <div className="auth-alert" role="alert"><p className="text-xs font-medium">{error}</p></div> : null}

      <div className="flex justify-end border-t border-[#D8E1EE] pt-5">
        <button className="inline-flex items-center gap-2 rounded-xl bg-[#001040] px-6 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={pending} type="submit">
          {pending ? "Menyimpan..." : "Lanjutkan"} <ArrowRight size={17} weight="bold" />
        </button>
      </div>
    </form>
  );
}

function RequiredField({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-sm font-bold text-[#001040] block" htmlFor={htmlFor}>
        {label} <span className="text-[#E11D48] ml-0.5" aria-hidden="true">*</span>
      </label>
      {children}
    </div>
  );
}
