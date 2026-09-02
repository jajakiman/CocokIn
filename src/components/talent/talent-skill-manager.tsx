"use client";

import { Plus, Trash, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/src/design-system/status-badge";
import { CAREER_TAXONOMY } from "@/src/modules/talent/career-taxonomy";

type ManagedSkill = {
  id: string;
  name: string;
  category: string;
  evidenceLevel: string;
};

const evidenceLabel: Record<string, string> = {
  SELF_DECLARED: "Self-Declared",
  ASSESSED: "Assessed",
  PROJECT_APPLIED: "Project Applied",
  PROJECT_VERIFIED: "Verified",
};

const evidenceTone: Record<string, "neutral" | "info" | "warning" | "success"> = {
  SELF_DECLARED: "neutral",
  ASSESSED: "info",
  PROJECT_APPLIED: "warning",
  PROJECT_VERIFIED: "success",
};

const suggestedSkills = Array.from(new Set(
  Object.values(CAREER_TAXONOMY).flatMap((career) => career.technicalSkills.map((skill) => skill.name)),
));

export function TalentSkillManager({ skills: initialSkills, compact = false }: { skills: ManagedSkill[]; compact?: boolean }) {
  const router = useRouter();
  const [skills, setSkills] = useState(initialSkills);
  const [open, setOpen] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef(false);

  function closeDialog() {
    restoreFocusRef.current = true;
    setOpen(false);
  }

  useEffect(() => {
    if (!open) {
      if (restoreFocusRef.current) {
        restoreFocusRef.current = false;
        triggerRef.current?.focus();
      }
      return;
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDialog();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function keepFocusInDialog(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const controls = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!controls?.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function claimSkill() {
    if (!skillName.trim()) return setError("Pilih atau masukkan nama keahlian.");
    setPending(true);
    setError(undefined);
    try {
      const response = await fetch("/api/talent/skills", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ skillName }),
      });
      const result = await response.json();
      if (!response.ok) return setError(result.message);
      setSkills((current) => current.some((skill) => skill.id === result.skill.id) ? current : [...current, result.skill]);
      setSkillName("");
      closeDialog();
      router.refresh();
    } catch {
      setError("Terjadi kendala jaringan. Silakan coba lagi.");
    } finally {
      setPending(false);
    }
  }

  async function removeSkill(skill: ManagedSkill) {
    if (!window.confirm(`Hapus klaim keahlian ${skill.name}?`)) return;
    setPending(true);
    setError(undefined);
    try {
      const response = await fetch("/api/talent/skills", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ talentSkillId: skill.id }),
      });
      const result = await response.json();
      if (!response.ok) return setError(result.message);
      setSkills((current) => current.filter((item) => item.id !== skill.id));
      router.refresh();
    } catch {
      setError("Terjadi kendala jaringan. Silakan coba lagi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="space-y-4" aria-labelledby="talent-skills-title">
      <div className="flex items-center justify-between gap-4">
        {compact ? <h2 id="talent-skills-title" className="text-lg font-semibold text-[#001040]">Keahlian</h2> : <span id="talent-skills-title" className="sr-only">Keahlian Talent</span>}
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#001040] px-4 text-sm font-semibold text-white hover:bg-[#001A66] focus:outline-none focus:ring-2 focus:ring-[#006FE6] focus:ring-offset-2"
          onClick={() => { setError(undefined); setOpen(true); }}
          ref={triggerRef}
          type="button"
        >
          <Plus aria-hidden="true" size={18} weight="bold" />
          Klaim keahlian baru
        </button>
      </div>

      {error && !open ? <p className="rounded-lg border border-[#BE123C] bg-[#FFF1F2] p-3 text-sm text-[#9F1239]" role="alert">{error}</p> : null}

      {skills.length === 0 ? (
        <div className="rounded-xl border border-[#D8E1EE] bg-white p-8 text-center text-sm text-[#53647A]">
          Belum ada keahlian. Klaim keahlian pertama untuk meningkatkan kualitas rekomendasi proyek.
        </div>
      ) : (
        <div className={compact ? "flex flex-wrap gap-2" : "space-y-3"}>
          {skills.map((skill) => compact ? (
            <span className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[#D8E1EE] bg-[#F1F5FB] pl-3 text-sm font-medium text-[#001040]" key={skill.id}>
              {skill.name}
              {skill.evidenceLevel === "SELF_DECLARED" ? (
                <button aria-label={`Hapus ${skill.name}`} className="flex h-11 w-11 items-center justify-center rounded-lg text-[#BE123C] hover:bg-[#FFF1F2] focus:outline-none focus:ring-2 focus:ring-[#006FE6]" disabled={pending} onClick={() => removeSkill(skill)} type="button"><X aria-hidden="true" size={16} /></button>
              ) : null}
            </span>
          ) : (
            <article className="flex items-center justify-between gap-4 rounded-xl border border-[#D8E1EE] bg-white p-5" key={skill.id}>
              <div>
                <h3 className="text-lg font-semibold text-[#001040]">{skill.name}</h3>
                <p className="mt-1 text-sm text-[#53647A]">Kategori: {skill.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge tone={evidenceTone[skill.evidenceLevel] ?? "neutral"}>{evidenceLabel[skill.evidenceLevel] ?? skill.evidenceLevel}</StatusBadge>
                {skill.evidenceLevel === "SELF_DECLARED" ? (
                  <button aria-label={`Hapus ${skill.name}`} className="flex h-11 w-11 items-center justify-center rounded-lg text-[#BE123C] hover:bg-[#FFF1F2] focus:outline-none focus:ring-2 focus:ring-[#006FE6]" disabled={pending} onClick={() => removeSkill(skill)} type="button">
                    <Trash aria-hidden="true" size={19} />
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001040]/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
          <div aria-labelledby="claim-skill-title" aria-modal="true" className="w-full max-w-md rounded-2xl border border-[#D8E1EE] bg-white p-6 shadow-[0_20px_40px_-8px_rgb(0_16_64/0.2)]" onKeyDown={keepFocusInDialog} ref={dialogRef} role="dialog">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#001040]" id="claim-skill-title">Klaim keahlian</h2>
                <p className="mt-1 text-sm leading-5 text-[#53647A]">Tambahkan kemampuan yang benar-benar Anda kuasai. Klaim awal akan berstatus Self-Declared.</p>
              </div>
              <button aria-label="Tutup dialog" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#53647A] hover:bg-[#F1F5FB] focus:outline-none focus:ring-2 focus:ring-[#006FE6]" onClick={closeDialog} type="button"><X aria-hidden="true" size={20} /></button>
            </div>

            <label className="mt-5 block text-sm font-semibold text-[#001040]" htmlFor="skill-name">Nama keahlian</label>
            <input autoFocus className="mt-2 min-h-11 w-full rounded-lg border border-[#D8E1EE] px-3 text-sm text-[#001040] focus:outline-none focus:ring-2 focus:ring-[#006FE6]" id="skill-name" maxLength={60} onChange={(event) => setSkillName(event.target.value)} placeholder="Contoh: React" value={skillName} />

            <div className="mt-4 flex max-h-36 flex-wrap gap-2 overflow-y-auto" aria-label="Saran keahlian">
              {suggestedSkills.filter((name) => !skills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())).map((name) => (
                <button className="min-h-11 rounded-lg border border-[#D8E1EE] px-3 text-sm text-[#001040] hover:border-[#006FE6] hover:bg-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#006FE6]" key={name} onClick={() => setSkillName(name)} type="button">{name}</button>
              ))}
            </div>

            {error ? <p className="mt-4 rounded-lg border border-[#BE123C] bg-[#FFF1F2] p-3 text-sm text-[#9F1239]" role="alert">{error}</p> : null}
            <button className="mt-5 min-h-11 w-full rounded-lg bg-[#001040] px-4 text-sm font-semibold text-white hover:bg-[#001A66] focus:outline-none focus:ring-2 focus:ring-[#006FE6] focus:ring-offset-2 disabled:opacity-50" disabled={pending} onClick={claimSkill} type="button">{pending ? "Menyimpan..." : "Klaim keahlian"}</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
