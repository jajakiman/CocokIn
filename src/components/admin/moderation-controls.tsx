"use client";

import { useActionState } from "react";

import {
  resolveMessageReportAction,
  restoreUserAction,
  suspendUserAction,
  type ModerationActionState,
} from "@/src/adapters/admin/moderation-actions";

const initialState: ModerationActionState = { ok: false, message: "" };

export function UserModerationControl({ userId, isSuspended }: { userId: string; isSuspended: boolean }) {
  const action = isSuspended ? restoreUserAction : suspendUserAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-2">
      <input type="hidden" name="userId" value={userId} />
      <label htmlFor={`${isSuspended ? "restore" : "suspend"}-${userId}`} className="text-xs font-bold text-[#001040]">
        Alasan {isSuspended ? "pemulihan" : "penangguhan"}
      </label>
      <textarea
        id={`${isSuspended ? "restore" : "suspend"}-${userId}`}
        name="reason"
        required
        minLength={10}
        maxLength={500}
        rows={2}
        className="rounded-lg border border-[#D8E1EE] p-3 text-sm"
        placeholder={isSuspended ? "Jelaskan dasar pemulihan akses..." : "Jelaskan pelanggaran atau risiko akun..."}
      />
      {!isSuspended ? (
        <label className="flex gap-2 text-xs text-[#53647A]">
          <input type="checkbox" name="confirmed" value="true" required />
          Saya memahami bahwa sesi akun akan ditolak setelah penangguhan.
        </label>
      ) : null}
      {state.message ? <p role={state.ok ? "status" : "alert"} className={`text-xs ${state.ok ? "text-[#047857]" : "text-[#BE123C]"}`}>{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className={`min-h-11 rounded-lg px-4 text-sm font-bold disabled:opacity-50 ${isSuspended ? "border border-[#047857] text-[#047857] hover:bg-[#ECFDF5]" : "bg-[#BE123C] !text-white hover:bg-[#9F1239]"}`}
      >
        {pending ? "Memproses..." : isSuspended ? "Pulihkan Akun" : "Tangguhkan Akun"}
      </button>
    </form>
  );
}

export function ReportResolutionControl({ reportId }: { reportId: string }) {
  const [state, formAction, pending] = useActionState(resolveMessageReportAction, initialState);

  return (
    <form action={formAction} className="grid gap-2">
      <input type="hidden" name="reportId" value={reportId} />
      <label htmlFor={`report-notes-${reportId}`} className="text-xs font-bold text-[#001040]">Catatan putusan</label>
      <textarea id={`report-notes-${reportId}`} name="notes" required minLength={10} maxLength={1000} rows={3} className="rounded-lg border border-[#D8E1EE] p-3 text-sm" placeholder="Tuliskan hasil peninjauan konteks pesan..." />
      {state.message ? <p role={state.ok ? "status" : "alert"} className={`text-xs ${state.ok ? "text-[#047857]" : "text-[#BE123C]"}`}>{state.message}</p> : null}
      <div className="grid grid-cols-2 gap-2">
        <button disabled={pending} type="submit" name="resolution" value="DISMISSED" className="min-h-11 rounded-lg border border-[#9AABC2] px-3 text-sm font-bold text-[#001040] hover:bg-[#F1F5FB] disabled:opacity-50">Abaikan</button>
        <button disabled={pending} type="submit" name="resolution" value="ACTIONED" className="min-h-11 rounded-lg bg-[#BE123C] px-3 text-sm font-bold !text-white hover:bg-[#9F1239] disabled:opacity-50">Tindak Lanjut</button>
      </div>
    </form>
  );
}
