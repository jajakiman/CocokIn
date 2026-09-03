"use client";

import { useActionState, useEffect } from "react";
import { acceptApplicantAction, type ActionState } from "@/src/adapters/projects/project-actions";
import { useRouter } from "next/navigation";

export function AcceptTalentForm({ applicationId, projectId }: { applicationId: string; projectId?: string }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    acceptApplicantAction,
    { ok: true, message: "" }
  );

  useEffect(() => {
    if (state.ok && state.message) {
      // Short delay so they can read the success message before redirecting
      const timer = setTimeout(() => {
        router.push(projectId ? `/business/projects/${projectId}/funding` : "/business");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state, router, projectId]);

  return (
    <form action={formAction}>
      {!state.ok && state.message && (
        <div className="bg-[#FFF1F2] border border-[#E11D48] text-[#E11D48] p-3 rounded-lg text-sm mb-3">
          {state.message}
        </div>
      )}
      
      {state.ok && state.message && (
        <div className="bg-[#ECFDF5] border border-[#059669] text-[#059669] p-3 rounded-lg text-sm mb-3 font-semibold">
          {state.message}
        </div>
      )}

      <input type="hidden" name="applicationId" value={applicationId} />
      <button 
        disabled={isPending || (state.ok && state.message !== "")} 
        type="submit" 
        className="w-full bg-[#006FE6] hover:bg-[#006FE6]/90 !text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 text-sm"
      >
        {isPending ? "Memproses..." : "Pilih Talent Ini"}
      </button>
    </form>
  );
}
