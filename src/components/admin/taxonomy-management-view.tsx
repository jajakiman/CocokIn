"use client";

import { useActionState, useState } from "react";

import { createSkillAction, saveAssessmentQuestionAction, toggleAssessmentQuestionAction, updateCareerBenchmarkAction, type TaxonomyActionState } from "@/src/adapters/admin/taxonomy-actions";

export type MasterData = {
  skills: Array<{ id: string; key: string | null; name: string; category: string; isActive: boolean }>;
  careers: Array<{ id: string; key: string | null; name: string; requirements: Array<{ skillId: string; benchmarkScore: number; skill: { name: string } }> }>;
  questions: Array<{ id: string; audience: string; kind: string; careerKey: string | null; skillKey: string | null; pillar: string | null; text: string; position: number; isActive: boolean; options: Array<{ label: string; score: number; position: number }> }>;
};

const initial: TaxonomyActionState = { ok: false, message: "" };

function Feedback({ state }: { state: TaxonomyActionState }) {
  return state.message ? <p role={state.ok ? "status" : "alert"} className={`text-xs ${state.ok ? "text-[#047857]" : "text-[#BE123C]"}`}>{state.message}</p> : null;
}

function QuestionEditor({ data, editing, onClear }: { data: MasterData; editing: MasterData["questions"][number] | null; onClear: () => void }) {
  const [state, action, pending] = useActionState(saveAssessmentQuestionAction, initial);
  const [audience, setAudience] = useState(editing?.audience ?? "TALENT");
  const [options, setOptions] = useState(() => editing && editing.options.length >= 2
    ? [...editing.options].sort((a, b) => a.position - b.position).map(({ label, score }) => ({ label, score }))
    : [{ label: "", score: 100 }, { label: "", score: 20 }, { label: "", score: 10 }, { label: "", score: 0 }]);

  return (
    <form action={action} className="grid gap-4 rounded-xl border border-[#D8E1EE] p-5">
      <h3 className="font-bold text-[#001040]">Buat / Perbarui Pertanyaan</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-xs font-bold text-[#001040]">ID stabil<input name="id" required readOnly={Boolean(editing)} defaultValue={editing?.id} pattern="[a-z0-9-]+" className="mt-1 w-full rounded-lg border p-2.5 font-normal read-only:bg-[#F1F5FB]" placeholder="fs-api-2" /></label>
        <label className="text-xs font-bold text-[#001040]">Posisi<input name="position" type="number" min="0" required className="mt-1 w-full rounded-lg border p-2.5 font-normal" defaultValue={editing?.position ?? 0} /></label>
        <label className="text-xs font-bold text-[#001040]">Audiens<select name="audience" value={audience} onChange={(event) => setAudience(event.target.value)} className="mt-1 w-full rounded-lg border p-2.5 font-normal"><option value="TALENT">Talent</option><option value="BUSINESS">UMKM</option></select></label>
        <label className="text-xs font-bold text-[#001040]">Tipe<select name="kind" defaultValue={editing?.kind} className="mt-1 w-full rounded-lg border p-2.5 font-normal">{audience === "TALENT" ? <><option value="TECHNICAL">Teknis</option><option value="SOFT_SKILL">Soft Skill</option></> : <option value="BUSINESS_READINESS">Kesiapan Bisnis</option>}</select></label>
        {audience === "TALENT" ? <>
          <label className="text-xs font-bold text-[#001040]">Karier<select name="careerKey" required defaultValue={editing?.careerKey ?? undefined} className="mt-1 w-full rounded-lg border p-2.5 font-normal">{data.careers.map((career) => <option key={career.id} value={career.key ?? ""}>{career.name}</option>)}</select></label>
          <label className="text-xs font-bold text-[#001040]">Skill<select name="skillKey" required defaultValue={editing?.skillKey ?? undefined} className="mt-1 w-full rounded-lg border p-2.5 font-normal">{data.skills.filter((skill) => skill.key).map((skill) => <option key={skill.id} value={skill.key!}>{skill.name}</option>)}</select></label>
        </> : <label className="text-xs font-bold text-[#001040] sm:col-span-2">Pilar<input name="pillar" required defaultValue={editing?.pillar ?? ""} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="Keuangan Digital" /></label>}
      </div>
      <label className="text-xs font-bold text-[#001040]">Teks pertanyaan<textarea name="text" defaultValue={editing?.text} required minLength={10} maxLength={1000} rows={3} className="mt-1 w-full rounded-lg border p-3 font-normal" /></label>
      <div className="grid gap-2">
        <span className="text-xs font-bold text-[#001040]">Opsi jawaban (2-4 opsi, tepat satu skor 100)</span>
        {options.map((option, index) => <div key={`${editing?.id ?? "new"}-${index}`} className="grid grid-cols-[1fr_6rem] gap-2"><input aria-label={`Opsi ${index + 1}`} required value={option.label} onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} className="rounded-lg border p-2.5 text-sm" placeholder={`Opsi ${index + 1}`} /><input aria-label={`Skor opsi ${index + 1}`} type="number" min="0" max="100" required value={option.score} onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, score: Number(event.target.value) } : item))} className="rounded-lg border p-2.5 text-sm" /></div>)}
      </div>
      <input type="hidden" name="optionsJson" value={JSON.stringify(options)} />
      <Feedback state={state} />
      <div className="grid grid-cols-2 gap-2"><button type="button" onClick={onClear} className="min-h-11 rounded-lg border px-4 text-sm font-bold text-[#001040]">Kosongkan</button><button disabled={pending} className="min-h-11 rounded-lg bg-[#001040] px-4 text-sm font-bold !text-white disabled:opacity-50">{pending ? "Menyimpan..." : "Simpan Pertanyaan"}</button></div>
    </form>
  );
}

export function TaxonomyManagementView({ data }: { data: MasterData }) {
  const [skillState, skillAction, skillPending] = useActionState(createSkillAction, initial);
  const [editing, setEditing] = useState<MasterData["questions"][number] | null>(null);
  return <div className="space-y-6">
    <div><h2 className="text-xl font-bold text-[#001040]">Master Data & Bank Soal</h2><p className="text-sm text-[#53647A] mt-1">Perubahan berlaku untuk asesmen berikutnya dan dicatat pada audit log.</p></div>
    <div className="grid lg:grid-cols-2 gap-6">
      <form action={skillAction} className="grid gap-3 rounded-xl border border-[#D8E1EE] bg-white p-5 shadow-sm">
        <h3 className="font-bold text-[#001040]">Tambah Skill</h3>
        <input name="key" required pattern="[a-z0-9-]+" className="rounded-lg border p-2.5 text-sm" placeholder="Key: product-design" />
        <input name="name" required className="rounded-lg border p-2.5 text-sm" placeholder="Nama skill" />
        <input name="category" required className="rounded-lg border p-2.5 text-sm" placeholder="Kategori" />
        <Feedback state={skillState} /><button disabled={skillPending} className="min-h-11 rounded-lg bg-[#001040] text-sm font-bold !text-white">Tambah Skill</button>
      </form>
      <div className="rounded-xl border border-[#D8E1EE] bg-white p-5 shadow-sm max-h-72 overflow-y-auto"><h3 className="font-bold text-[#001040] mb-3">Daftar Skill ({data.skills.length})</h3>{data.skills.map((skill) => <div key={skill.id} className="flex justify-between gap-3 border-t py-2 text-sm"><span className="text-[#001040]">{skill.name}</span><span className="text-[#53647A]">{skill.category}</span></div>)}</div>
    </div>
    <div className="rounded-xl border border-[#D8E1EE] bg-white p-5 shadow-sm"><h3 className="font-bold text-[#001040] mb-4">Benchmark Karier</h3><div className="grid md:grid-cols-2 gap-5">{data.careers.map((career) => <section key={career.id}><h4 className="text-sm font-bold text-[#006FE6]">{career.name}</h4>{career.requirements.map((requirement) => <BenchmarkForm key={requirement.skillId} careerId={career.id} requirement={requirement} />)}</section>)}</div></div>
    <QuestionEditor key={editing?.id ?? "new"} data={data} editing={editing} onClear={() => setEditing(null)} />
    <div className="rounded-xl border border-[#D8E1EE] bg-white p-5 shadow-sm"><h3 className="font-bold text-[#001040] mb-3">Pertanyaan ({data.questions.length})</h3><div className="divide-y">{data.questions.map((question) => <QuestionRow key={question.id} question={question} onEdit={() => setEditing(question)} />)}</div></div>
  </div>;
}

function BenchmarkForm({ careerId, requirement }: { careerId: string; requirement: MasterData["careers"][number]["requirements"][number] }) {
  const [state, action, pending] = useActionState(updateCareerBenchmarkAction, initial);
  return <form action={action} className="grid grid-cols-[1fr_5rem_auto] items-center gap-2 py-2 border-b"><input type="hidden" name="careerId" value={careerId} /><input type="hidden" name="skillId" value={requirement.skillId} /><span className="text-xs text-[#001040]">{requirement.skill.name}</span><input name="benchmarkScore" type="number" min="0" max="100" defaultValue={requirement.benchmarkScore} className="rounded border p-2 text-sm" /><button disabled={pending} className="text-xs font-bold text-[#006FE6]">Simpan</button><div className="col-span-3"><Feedback state={state} /></div></form>;
}

function QuestionRow({ question, onEdit }: { question: MasterData["questions"][number]; onEdit: () => void }) {
  const [state, action, pending] = useActionState(toggleAssessmentQuestionAction, initial);
  return <div className="py-3 flex flex-col sm:flex-row justify-between gap-3"><div><div className="flex gap-2"><span className="text-[11px] font-bold text-[#006FE6]">{question.audience}</span><span className="text-[11px] text-[#53647A]">{question.kind}</span></div><p className="text-sm font-semibold text-[#001040] mt-1">{question.text}</p></div><div className="flex items-start gap-2"><button type="button" onClick={onEdit} className="rounded-lg border px-3 py-2 text-xs font-bold text-[#006FE6]">Edit</button><form action={action}><input type="hidden" name="id" value={question.id} /><input type="hidden" name="isActive" value={String(!question.isActive)} /><button disabled={pending} className={`rounded-lg px-3 py-2 text-xs font-bold ${question.isActive ? "bg-[#FFF1F2] text-[#BE123C]" : "bg-[#ECFDF5] text-[#047857]"}`}>{question.isActive ? "Nonaktifkan" : "Aktifkan"}</button><Feedback state={state} /></form></div></div>;
}
