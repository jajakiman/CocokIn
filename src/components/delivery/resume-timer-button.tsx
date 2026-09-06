"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ResumeTimerButton({ milestoneSubmissionId }: { milestoneSubmissionId: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleResume = async () => {
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.append("milestoneSubmissionId", milestoneSubmissionId);
      const { resumeStagingAction } = await import("@/src/adapters/delivery/delivery-actions");
      const res = await resumeStagingAction(null, formData);
      alert(res.message);
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      alert("Gagal melanjutkan timer.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-[#FFFBEB] p-4 rounded-lg border border-[#FDE68A] mt-4">
      <h5 className="font-bold text-[#B45309] mb-2">Timer Auto-Approve Dijeda!</h5>
      <p className="text-sm text-[#92400E] mb-3">
        UMKM melaporkan bahwa server staging mati atau tidak bisa diakses. Harap perbaiki server staging dan klik tombol di bawah untuk melanjutkan timer review.
      </p>
      <button
        type="button"
        disabled={isPending}
        onClick={handleResume}
        className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50"
      >
        {isPending ? "Memproses..." : "Server Sudah Aktif (Lanjutkan Timer)"}
      </button>
    </div>
  );
}
