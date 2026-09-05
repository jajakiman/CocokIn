"use client";

import { useActionState, useState } from "react";
import { reviewHandoverAction, type HandoverActionState } from "@/src/adapters/projects/infrastructure-actions";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export function HandoverReviewPanel({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<HandoverActionState, FormData>(
    reviewHandoverAction,
    { ok: true, message: "" }
  );

  const [decision, setDecision] = useState<"ACCEPTED" | "DISPUTED">("ACCEPTED");

  return (
    <form action={formAction} className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm mt-6">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="decision" value={decision} />

      <h3 className="font-bold text-lg text-[#001040] mb-4">Keputusan Review Handover</h3>

      {!state.ok && state.message && (
        <div className="bg-[#FFF1F2] text-[#E11D48] p-4 rounded-lg border border-[#FECDD3] text-sm font-medium mb-4">
          {state.message}
        </div>
      )}
      {state.ok && state.message && (
        <div className="bg-[#ECFDF5] text-[#059669] p-4 rounded-lg border border-[#A7F3D0] text-sm font-medium mb-4">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button 
          type="button"
          onClick={() => setDecision("ACCEPTED")}
          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${
            decision === "ACCEPTED" 
              ? "border-[#059669] bg-[#ECFDF5] text-[#059669]" 
              : "border-[#D8E1EE] hover:border-[#A7F3D0] text-[#53647A]"
          }`}
        >
          <CheckCircle weight={decision === "ACCEPTED" ? "fill" : "regular"} size={32} />
          <span className="font-bold">Setujui & Tutup Proyek</span>
        </button>

        <button 
          type="button"
          onClick={() => setDecision("DISPUTED")}
          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${
            decision === "DISPUTED" 
              ? "border-[#E11D48] bg-[#FFF1F2] text-[#E11D48]" 
              : "border-[#D8E1EE] hover:border-[#FECDD3] text-[#53647A]"
          }`}
        >
          <XCircle weight={decision === "DISPUTED" ? "fill" : "regular"} size={32} />
          <span className="font-bold">Tolak Handover</span>
        </button>
      </div>

      <button 
        type="submit" 
        disabled={isPending || (state.ok && state.message !== "")}
        className={`w-full font-bold py-3 rounded-xl transition-colors disabled:opacity-50 text-white ${
          decision === "ACCEPTED" ? "bg-[#059669] hover:bg-[#047857]" : "bg-[#E11D48] hover:bg-[#BE123C]"
        }`}
      >
        {isPending ? "Memproses..." : decision === "ACCEPTED" ? "Konfirmasi Handover Selesai" : "Kirim Penolakan"}
      </button>
    </form>
  );
}
