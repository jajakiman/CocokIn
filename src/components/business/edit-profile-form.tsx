"use client";

import { useActionState } from "react";
import { updateBusinessProfileAction, type ActionState } from "@/src/adapters/business/business-actions";
import { useRouter } from "next/navigation";
import type { BusinessProfile } from "@prisma/client";

export function EditBusinessProfileForm({ profile }: { profile: BusinessProfile }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateBusinessProfileAction,
    { ok: true, message: "" }
  );

  return (
    <form action={formAction} className="bg-white p-6 md:p-8 rounded-xl border border-[#D8E1EE] shadow-sm space-y-6">
      {!state.ok && state.message && (
        <div className="bg-[#FFF1F2] border border-[#E11D48] text-[#E11D48] p-4 rounded-lg">
          {state.message}
        </div>
      )}

      {state.ok && state.message && (
        <div className="bg-[#ECFDF5] border border-[#059669] text-[#059669] p-4 rounded-lg">
          {state.message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#001040] mb-1">Nama Bisnis</label>
          <input 
            type="text" 
            name="businessName" 
            defaultValue={profile.businessName}
            required
            className="w-full px-4 py-2 border border-[#D8E1EE] rounded-lg focus:outline-none focus:border-[#0080FF]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#001040] mb-1">Kategori Industri</label>
          <select 
            name="industryCategory" 
            defaultValue={profile.industryCategory || ""}
            className="w-full px-4 py-2 border border-[#D8E1EE] rounded-lg focus:outline-none focus:border-[#0080FF]"
          >
            <option value="">Pilih Kategori</option>
            <option value="F&B">F&B</option>
            <option value="Retail">Retail</option>
            <option value="Jasa">Jasa</option>
            <option value="Teknologi">Teknologi</option>
            <option value="Manufaktur">Manufaktur</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#001040] mb-1">Lokasi (Kota/Kabupaten)</label>
          <input 
            type="text" 
            name="location" 
            defaultValue={profile.location || ""}
            className="w-full px-4 py-2 border border-[#D8E1EE] rounded-lg focus:outline-none focus:border-[#0080FF]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#001040] mb-1">Deskripsi Bisnis</label>
          <textarea 
            name="description" 
            rows={4}
            defaultValue={profile.description || ""}
            className="w-full px-4 py-2 border border-[#D8E1EE] rounded-lg focus:outline-none focus:border-[#0080FF]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-[#D8E1EE]">
        <button 
          type="button" 
          onClick={() => router.push("/business/my-profile")}
          className="px-6 py-2 border border-[#D8E1EE] text-[#53647A] font-bold rounded-lg hover:bg-[#F8FAFC] transition-colors"
        >
          Batal
        </button>
        <button 
          type="submit" 
          disabled={isPending}
          className="px-6 py-2 bg-[#001040] text-white font-bold rounded-lg hover:bg-[#001040]/90 transition-colors disabled:opacity-50"
        >
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
