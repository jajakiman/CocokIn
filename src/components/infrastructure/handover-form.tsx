"use client";

import { useActionState } from "react";
import { submitHandoverAction, type HandoverActionState } from "@/src/adapters/projects/infrastructure-actions";
import { useRouter } from "next/navigation";
import { CheckCircle, Info } from "@phosphor-icons/react";

export function HandoverForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<HandoverActionState, FormData>(
    submitHandoverAction,
    { ok: true, message: "" }
  );

  return (
    <form action={formAction} className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm flex flex-col gap-6">
      <input type="hidden" name="projectId" value={projectId} />

      <div>
        <h3 className="font-bold text-lg text-[#001040] mb-2">Formulir Handover Infrastruktur</h3>
        <p className="text-sm text-[#53647A]">Silakan isi formulir ini untuk menyerahkan hasil akhir proyek kepada UMKM. Pastikan semua persyaratan telah terpenuhi.</p>
      </div>

      {!state.ok && state.message && (
        <div className="bg-[#FFF1F2] text-[#E11D48] p-4 rounded-lg border border-[#FECDD3] text-sm font-medium">
          {state.message}
        </div>
      )}
      {state.ok && state.message && (
        <div className="bg-[#ECFDF5] text-[#059669] p-4 rounded-lg border border-[#A7F3D0] text-sm font-medium">
          {state.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-[#001040] mb-1">URL Produksi (Live) <span className="text-[#E11D48]">*</span></label>
        <p className="text-xs text-[#53647A] mb-2">Tautan ke aplikasi yang sudah bisa diakses publik (misal: https://toko-budi.com)</p>
        <input 
          type="url" 
          name="productionUrl" 
          required 
          placeholder="https://..."
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#006FE6] outline-none"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-[#001040]">Checklist Persiapan <span className="text-[#E11D48]">*</span></label>
        
        <label className="flex items-start gap-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="domainConfigured" className="mt-1 w-4 h-4" required />
          <div>
            <div className="font-bold text-sm text-[#001040]">Domain Terkonfigurasi</div>
            <div className="text-xs text-[#53647A]">Domain kustom UMKM sudah diarahkan dengan benar ke server produksi.</div>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="httpsActive" className="mt-1 w-4 h-4" required />
          <div>
            <div className="font-bold text-sm text-[#001040]">HTTPS Aktif</div>
            <div className="text-xs text-[#53647A]">Sertifikat SSL telah dipasang dan koneksi aman gembok (HTTPS) sudah aktif.</div>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="sourceCodeTransferred" className="mt-1 w-4 h-4" required />
          <div>
            <div className="font-bold text-sm text-[#001040]">Source Code & Akses Diserahkan</div>
            <div className="text-xs text-[#53647A]">Akses repository atau kredensial hosting telah diserahkan sepenuhnya ke UMKM.</div>
          </div>
        </label>
      </div>

      <div className="bg-[#EFF6FF] p-4 rounded-lg border border-[#BFDBFE] flex gap-3 text-sm">
        <Info className="text-[#3B82F6] shrink-0 mt-0.5" size={20} weight="fill" />
        <p className="text-[#1E3A8A]">
          Dengan mensubmit form ini, Anda mengonfirmasi bahwa seluruh infrastruktur telah siap. UMKM akan mereview hasil handover ini sebelum proyek dinyatakan selesai secara resmi.
        </p>
      </div>

      <button 
        type="submit" 
        disabled={isPending || (state.ok && state.message !== "")}
        className="w-full bg-[#006FE6] hover:bg-[#005AB3] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 mt-4"
      >
        {isPending ? "Memproses..." : "Submit Handover"}
      </button>
    </form>
  );
}
