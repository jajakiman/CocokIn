"use client";

import { useActionState, useState } from "react";
import { submitMilestoneAction, type DeliveryActionState } from "@/src/adapters/delivery/delivery-actions";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "@phosphor-icons/react";

export function MilestoneSubmissionForm({ projectMilestoneId }: { projectMilestoneId: string }) {
  const [state, formAction, isPending] = useActionState<DeliveryActionState, FormData>(
    submitMilestoneAction,
    { ok: true, message: "" }
  );

  const [dismissedState, setDismissedState] = useState(state);
  const showModal = state.message !== "" && state !== dismissedState;

  return (
    <>
      <form action={formAction} className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm space-y-4">
        <input type="hidden" name="projectMilestoneId" value={projectMilestoneId} />
        
        <div>
          <label className="block text-sm font-bold text-[#001040] mb-1">URL Staging / Preview <span className="text-[#E11D48]">*</span></label>
          <p className="text-xs text-[#53647A] mb-2">Tautan tempat UMKM dapat melihat dan menguji hasil pekerjaan Anda (contoh: Vercel, Figma, Google Drive).</p>
          <input 
            required 
            type="url"
            name="stagingUrl" 
            placeholder="https://..." 
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#006FE6] outline-none transition-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#001040] mb-1">Ringkasan Pekerjaan <span className="text-[#E11D48]">*</span></label>
          <p className="text-xs text-[#53647A] mb-2">Jelaskan fitur atau bagian apa saja yang telah diselesaikan pada milestone ini.</p>
          <textarea 
            required 
            name="summary" 
            rows={3}
            placeholder="Saya telah menyelesaikan..." 
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#006FE6] outline-none transition-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#001040] mb-1">Instruksi Tambahan (Opsional)</label>
          <p className="text-xs text-[#53647A] mb-2">Kredensial login untuk testing, langkah pengujian khusus, dsb. (Akan terlihat oleh UMKM).</p>
          <textarea 
            name="instructions" 
            rows={2}
            placeholder="Username test: admin, Password: password123" 
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#006FE6] outline-none transition-shadow"
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending || (state.ok && state.message !== "")}
          className="w-full bg-[#006FE6] hover:bg-[#005DCC] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 mt-4"
        >
          {isPending ? "Mengirim..." : "Kumpulkan Milestone"}
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
                {state.ok ? "Terkirim!" : "Gagal"}
              </h2>
              <p className="text-[#53647A] mb-6 whitespace-pre-line">
                {state.message}
              </p>

              <button
                type="button"
                onClick={() => setDismissedState(state)}
                className="w-full bg-[#001040] text-white font-bold py-3 rounded-xl hover:bg-[#001040]/90 transition-colors"
              >
                {state.ok ? "Tutup" : "Coba Lagi"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
