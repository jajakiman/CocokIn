"use client";

import { useActionState, useState, useEffect } from "react";
import { Plus, Trash, Info, CheckCircle, XCircle } from "@phosphor-icons/react";
import { createProjectAction, type ActionState } from "@/src/adapters/projects/project-actions";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function CreateProjectForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    createProjectAction,
    { ok: true, message: "" }
  );

  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  
  const [milestones, setMilestones] = useState([
    { id: 1, title: "Milestone 1", weightBps: 10000, deadline: "", acceptanceCriteria: [""] }
  ]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (state.message !== "") {
      setShowModal(true);
    }
  }, [state]);

  const handleModalOk = () => {
    setShowModal(false);
    if (state.ok) {
      router.push("/business");
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (sk: string) => {
    setSkills(skills.filter(s => s !== sk));
  };

  const addMilestone = () => {
    if (milestones.length >= 4) return;
    setMilestones([
      ...milestones, 
      { id: Date.now(), title: `Milestone ${milestones.length + 1}`, weightBps: 0, deadline: "", acceptanceCriteria: [""] }
    ]);
  };

  const removeMilestone = (id: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const addCriterion = (milestoneId: number) => {
    setMilestones(milestones.map(m => {
      if (m.id === milestoneId) {
        return { ...m, acceptanceCriteria: [...m.acceptanceCriteria, ""] };
      }
      return m;
    }));
  };

  return (
    <>
      <form action={formAction} className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm space-y-6">
        {/* Hidden inputs to pass complex arrays to FormData */}
        <input type="hidden" name="skills" value={JSON.stringify(skills)} />
        <input type="hidden" name="milestones" value={JSON.stringify(milestones)} />

        <div className="space-y-4 border-b pb-6">
          <h2 className="text-xl font-bold text-[#001040]">Detail Proyek</h2>
          
          <div>
            <label className="block text-sm font-medium text-[#53647A] mb-1">Judul Proyek</label>
            <input required name="title" className="w-full border p-2 rounded-lg" placeholder="Cth: Pembuatan Katalog Digital" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#53647A] mb-1">Scope Pekerjaan</label>
            <textarea required name="scope" rows={3} className="w-full border p-2 rounded-lg" placeholder="Jelaskan kebutuhan Anda secara detail..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#53647A] mb-1">Tingkat Kesulitan</label>
              <select name="difficulty" className="w-full border p-2 rounded-lg">
                <option value="BEGINNER">Beginner (Pemula)</option>
                <option value="INTERMEDIATE">Intermediate (Menengah)</option>
                <option value="ADVANCED">Advanced (Ahli)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#53647A] mb-1">Kebutuhan Infrastruktur</label>
              <select name="infrastructureNeed" className="w-full border p-2 rounded-lg">
                <option value="MANAGED_HOSTING">Managed Hosting (Direkomendasikan)</option>
                <option value="STAGING_ONLY">Hanya Staging (Tidak rilis publik)</option>
                <option value="SHARED_HOSTING">Shared Hosting (Sederhana)</option>
                <option value="VPS">VPS (Khusus mahir)</option>
                <option value="EXISTING_INFRASTRUCTURE">Sudah Punya Hosting Sendiri</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#53647A] mb-1">Estimasi Hari Kerja</label>
              <input required type="number" name="estimatedDays" min={1} className="w-full border p-2 rounded-lg" placeholder="Minimal 1 hari" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#53647A] mb-1">Batas Akhir Pencarian Talent</label>
              <input required type="date" name="deadline" className="w-full border p-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#53647A] mb-1">Nilai Imbalan (Rp)</label>
              <input required type="number" name="serviceValue" min={100000} className="w-full border p-2 rounded-lg" placeholder="Minimal Rp 100.000" />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-b pb-6">
          <h2 className="text-xl font-bold text-[#001040]">Keahlian yang Dibutuhkan</h2>
          <div className="flex gap-2">
            <input 
              value={currentSkill} 
              onChange={(e) => setCurrentSkill(e.target.value)} 
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              className="flex-1 border p-2 rounded-lg" 
              placeholder="Cth: React, Graphic Design..." 
            />
            <button type="button" onClick={(e) => { e.preventDefault(); addSkill(); }} className="bg-[#001040] text-white px-4 rounded-lg">Tambah</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map(sk => (
              <span key={sk} className="bg-[#EAF3FF] text-[#006FE6] px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {sk}
                <button type="button" onClick={() => removeSkill(sk)}><Trash size={14} /></button>
              </span>
            ))}
            {skills.length === 0 && <span className="text-sm text-gray-400">Belum ada keahlian ditambahkan.</span>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#001040]">Milestone Pengerjaan</h2>
            <button type="button" onClick={addMilestone} disabled={milestones.length >= 4} className="text-[#0080FF] text-sm font-medium flex items-center gap-1 disabled:opacity-50">
              <Plus weight="bold" /> Tambah Milestone
            </button>
          </div>
          
          {milestones.map((m, index) => (
            <div key={m.id} className="border border-[#D8E1EE] rounded-xl p-4 bg-[#F8FAFC]">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold text-[#001040]">Milestone {index + 1}</h3>
                {milestones.length > 1 && (
                  <button type="button" onClick={() => removeMilestone(m.id)} className="text-[#E11D48] text-sm">Hapus</button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-[#53647A] mb-1">Judul Milestone</label>
                  <input required value={m.title} onChange={e => {
                    const val = e.target.value;
                    setMilestones(milestones.map(mil => mil.id === m.id ? { ...mil, title: val } : mil));
                  }} className="w-full border p-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#53647A] mb-1">Bobot Pembayaran (%)</label>
                  <input required type="number" min={1} max={100} value={m.weightBps / 100} onChange={e => {
                    const val = Number(e.target.value) * 100;
                    setMilestones(milestones.map(mil => mil.id === m.id ? { ...mil, weightBps: val } : mil));
                  }} className="w-full border p-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#53647A] mb-1">Deadline Milestone</label>
                  <input required type="date" value={m.deadline} onChange={e => {
                    const val = e.target.value;
                    setMilestones(milestones.map(mil => mil.id === m.id ? { ...mil, deadline: val } : mil));
                  }} className="w-full border p-2 rounded-lg text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#53647A] mb-2">Acceptance Criteria</label>
                {m.acceptanceCriteria.map((crit, cIdx) => (
                  <div key={cIdx} className="flex gap-2 mb-2">
                    <input required value={crit} onChange={e => {
                      const val = e.target.value;
                      setMilestones(milestones.map(mil => {
                        if (mil.id === m.id) {
                          const newCrit = [...mil.acceptanceCriteria];
                          newCrit[cIdx] = val;
                          return { ...mil, acceptanceCriteria: newCrit };
                        }
                        return mil;
                      }));
                    }} className="flex-1 border p-2 rounded-lg text-sm" placeholder="Kriteria persetujuan..." />
                    {m.acceptanceCriteria.length > 1 && (
                      <button type="button" onClick={() => {
                        setMilestones(milestones.map(mil => {
                          if (mil.id === m.id) {
                            const newCrit = [...mil.acceptanceCriteria];
                            newCrit.splice(cIdx, 1);
                            return { ...mil, acceptanceCriteria: newCrit };
                          }
                          return mil;
                        }));
                      }} className="text-[#53647A] p-2 hover:bg-gray-200 rounded-lg"><Trash size={16} /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addCriterion(m.id)} className="text-[#0080FF] text-xs font-medium">+ Tambah Kriteria</button>
              </div>
            </div>
          ))}

          <div className="bg-[#FFFBEB] p-4 rounded-lg text-sm text-[#A04B00]">
            Total bobot milestone saat ini: <strong>{milestones.reduce((sum, m) => sum + m.weightBps, 0) / 100}%</strong>. Total wajib persis 100%.
          </div>
        </div>

        <button disabled={isPending || (state.ok && state.message !== "")} type="submit" className="w-full bg-[#FF8010] hover:bg-[#FF8010]/90 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 mt-8">
          {isPending ? "Memproses..." : "Terbitkan Proyek"}
        </button>
      </form>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl flex flex-col items-center"
            >
              {state.ok ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 12, stiffness: 200 }}
                  className="w-20 h-20 bg-[#ECFDF5] text-[#059669] rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle size={48} weight="fill" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 12, stiffness: 200 }}
                  className="w-20 h-20 bg-[#FFF1F2] text-[#E11D48] rounded-full flex items-center justify-center mb-6"
                >
                  <XCircle size={48} weight="fill" />
                </motion.div>
              )}

              <h2 className="text-2xl font-bold text-[#001040] mb-2">
                {state.ok ? "Sukses!" : "Gagal"}
              </h2>
              <p className="text-[#53647A] mb-6 whitespace-pre-line">
                {state.message}
                {!state.ok && state.errors && (
                  <span className="block mt-2 text-sm text-left">
                    {Object.entries(state.errors).map(([field, errs]) => (
                      <span key={field} className="block">• {field}: {errs.join(", ")}</span>
                    ))}
                  </span>
                )}
              </p>

              <button
                type="button"
                onClick={handleModalOk}
                className="w-full bg-[#001040] text-white font-bold py-3 rounded-xl hover:bg-[#001040]/90 transition-colors"
              >
                {state.ok ? "Lanjut ke Dashboard" : "Tutup"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
