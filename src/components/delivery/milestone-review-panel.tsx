"use client";

import { useActionState, useState } from "react";
import { reviewMilestoneAction, type DeliveryActionState } from "@/src/adapters/delivery/delivery-actions";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, WarningCircle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export function MilestoneReviewPanel({ 
  milestoneSubmissionId, 
  projectId 
}: { 
  milestoneSubmissionId: string,
  projectId: string
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<DeliveryActionState, FormData>(
    reviewMilestoneAction,
    { ok: true, message: "" }
  );

  const [decision, setDecision] = useState<"APPROVED" | "REVISION_REQUESTED" | "DISPUTED">("APPROVED");
  const [dismissedState, setDismissedState] = useState(state);
  const showModal = state.message !== "" && state !== dismissedState;

  const handleModalClose = () => {
    setDismissedState(state);
    if (state.ok) {
      router.push(`/business/projects/${projectId}`);
    }
  };

  return (
    <>
      <form action={formAction} className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm flex flex-col h-full">
        <input type="hidden" name="milestoneSubmissionId" value={milestoneSubmissionId} />
        <input type="hidden" name="decision" value={decision} />

        <div className="flex-1">
          <h3 className="font-bold text-lg text-[#001040] mb-4">Keputusan Review</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button 
              type="button"
              onClick={() => setDecision("APPROVED")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${
                decision === "APPROVED" 
                  ? "border-[#059669] bg-[#ECFDF5] text-[#059669]" 
                  : "border-[#D8E1EE] hover:border-[#A7F3D0] text-[#53647A]"
              }`}
            >
              <CheckCircle weight={decision === "APPROVED" ? "fill" : "regular"} size={32} />
              <span className="font-bold">Setujui Hasil</span>
            </button>

            <button 
              type="button"
              onClick={() => setDecision("REVISION_REQUESTED")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${
                decision === "REVISION_REQUESTED" 
                  ? "border-[#E11D48] bg-[#FFF1F2] text-[#E11D48]" 
                  : "border-[#D8E1EE] hover:border-[#FECDD3] text-[#53647A]"
              }`}
            >
              <WarningCircle weight={decision === "REVISION_REQUESTED" ? "fill" : "regular"} size={32} />
              <span className="font-bold">Minta Revisi</span>
            </button>
          </div>

          <AnimatePresence>
            {decision === "REVISION_REQUESTED" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="block text-sm font-bold text-[#001040] mb-1">Catatan Revisi <span className="text-[#E11D48]">*</span></label>
                <p className="text-xs text-[#53647A] mb-2">Jelaskan secara detail bagian mana yang belum sesuai dengan kriteria yang disepakati.</p>
                <textarea 
                  required
                  name="feedback" 
                  rows={4}
                  placeholder="Mohon perbaiki pada bagian..." 
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#E11D48] outline-none transition-shadow border-[#FECDD3]"
                />
              </motion.div>
            )}
            
            {decision === "APPROVED" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#ECFDF5] p-4 rounded-lg border border-[#A7F3D0] flex gap-3 text-sm">
                  <CheckCircle className="text-[#059669] shrink-0 mt-0.5" size={20} weight="fill" />
                  <p className="text-[#065F46]">
                    Dengan menyetujui hasil ini, Anda mengonfirmasi bahwa pekerjaan telah selesai sesuai kriteria. Dana yang terkunci di escrow (jika ada) akan diteruskan ke Talent.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-6 mt-6 border-t border-[#D8E1EE]">
          <button 
            type="submit" 
            disabled={isPending || (state.ok && state.message !== "")}
            className={`w-full font-bold py-3 rounded-xl transition-colors disabled:opacity-50 text-white mb-3 ${
              decision === "APPROVED" ? "bg-[#059669] hover:bg-[#047857]" : "bg-[#E11D48] hover:bg-[#BE123C]"
            }`}
          >
            {isPending ? "Memproses..." : decision === "APPROVED" ? "Setujui & Konfirmasi" : "Kirim Catatan Revisi"}
          </button>
          
          <button
            type="button"
            disabled={isPending}
            onClick={async () => {
              if (confirm("Yakin ingin melaporkan server mati? Timer review akan dijeda.")) {
                const formData = new FormData();
                formData.append("milestoneSubmissionId", milestoneSubmissionId);
                const { reportStagingDowntimeAction } = await import("@/src/adapters/delivery/delivery-actions");
                const res = await reportStagingDowntimeAction(null, formData);
                if (res.ok) {
                  alert(res.message);
                  router.refresh();
                } else {
                  alert(res.message);
                }
              }
            }}
            className="w-full font-bold py-3 rounded-xl transition-colors text-[#53647A] bg-[#F8FAFC] border border-[#D8E1EE] hover:bg-[#F1F5F9] text-sm"
          >
            Laporkan Server Mati (Pause Timer)
          </button>
        </div>
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
                {state.ok ? "Berhasil!" : "Gagal"}
              </h2>
              <p className="text-[#53647A] mb-6 whitespace-pre-line">
                {state.message}
              </p>

              <button
                type="button"
                onClick={handleModalClose}
                className="w-full bg-[#001040] text-white font-bold py-3 rounded-xl hover:bg-[#001040]/90 transition-colors"
              >
                {state.ok ? "Kembali ke Proyek" : "Tutup"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
