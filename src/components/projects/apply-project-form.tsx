"use client";

import { useActionState } from "react";
import { applyToProjectAction, type ActionState } from "@/src/adapters/projects/project-actions";

export function ApplyProjectForm({ projectId }: { projectId: string }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    applyToProjectAction,
    { ok: true, message: "" }
  );

  return (
    <form action={formAction} className="mt-8 space-y-4 bg-white p-6 rounded-xl border border-[#D8E1EE]">
      <h3 className="text-lg font-bold text-[#001040]">Lamar Proyek Ini</h3>
      
      {!state.ok && state.message && (
        <div className="bg-[#FFF1F2] border border-[#E11D48] text-[#E11D48] p-4 rounded-lg">
          {state.message}
        </div>
      )}

      {state.ok && state.message && (
        <div className="bg-[#ECFDF5] border border-[#059669] text-[#059669] p-4 rounded-lg font-semibold">
          {state.message}
        </div>
      )}

      <input type="hidden" name="projectId" value={projectId} />
      
      <div>
        <label className="block text-sm font-medium text-[#53647A] mb-1">Motivasi Singkat</label>
        <textarea required name="motivation" rows={4} className="w-full border p-2 rounded-lg" placeholder="Jelaskan mengapa Anda cocok untuk proyek ini..." />
      </div>

      <button disabled={isPending || (state.ok && state.message !== "")} type="submit" className="w-full bg-[#001040] hover:bg-[#001040]/90 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
        {isPending ? "Mengirim Lamaran..." : "Kirim Lamaran"}
      </button>
    </form>
  );
}
