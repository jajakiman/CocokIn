"use client";

import React, { useActionState } from "react";
import { signAgreementAction } from "@/src/adapters/projects/project-actions";
import { CheckCircle, Clock } from "@phosphor-icons/react";
import { Button } from "@/src/design-system/button"; // Assuming a button component exists, else we use raw HTML

interface ProjectAgreementCardProps {
  projectId: string;
  role: "BUSINESS" | "TALENT";
  talentAgreedAt: Date | null;
  businessAgreedAt: Date | null;
  serviceValue: bigint;
  estimatedDays: number;
}

export function ProjectAgreementCard({
  projectId,
  role,
  talentAgreedAt,
  businessAgreedAt,
  serviceValue,
  estimatedDays,
}: ProjectAgreementCardProps) {
  const [state, formAction, isPending] = useActionState(signAgreementAction, null);

  const hasSigned = role === "BUSINESS" ? !!businessAgreedAt : !!talentAgreedAt;
  const otherPartySigned = role === "BUSINESS" ? !!talentAgreedAt : !!businessAgreedAt;
  const otherPartyRole = role === "BUSINESS" ? "Talent" : "UMKM";

  return (
    <div className="bg-[#FFFFFF] border-2 border-[#001040] rounded-xl p-6 shadow-md mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#001040]">Perjanjian Proyek</h2>
          <p className="text-sm text-[#53647A]">Tahap Finalisasi Kesepakatan</p>
        </div>
        {hasSigned && otherPartySigned ? (
          <span className="bg-[#EAF5F8] text-[#0080FF] font-bold px-3 py-1 rounded-full flex items-center gap-1 text-sm border border-[#0080FF]/20">
            <CheckCircle size={16} weight="fill" /> Selesai
          </span>
        ) : (
          <span className="bg-[#FFF4E5] text-[#FF8010] font-bold px-3 py-1 rounded-full flex items-center gap-1 text-sm border border-[#FF8010]/20">
            <Clock size={16} weight="fill" /> Menunggu Tanda Tangan
          </span>
        )}
      </div>

      <div className="bg-[#F7F9FC] border border-[#D8E1EE] rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-sm text-[#001040]">
          <li className="flex justify-between">
            <span className="text-[#53647A]">Nilai Imbalan:</span>
            <span className="font-bold">
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(serviceValue))}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-[#53647A]">Estimasi Pengerjaan:</span>
            <span className="font-bold">{estimatedDays} Hari</span>
          </li>
          <li className="flex justify-between">
            <span className="text-[#53647A]">Mekanisme:</span>
            <span className="font-bold">Sistem Pembayaran Escrow (Aman)</span>
          </li>
        </ul>
        <p className="text-xs text-[#53647A] mt-4">
          Dengan menandatangani ini, Anda menyetujui seluruh detail scope pekerjaan dan bersedia mematuhi aturan platform CocokIn.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 flex gap-4">
          {/* Status indicators */}
          <div className="flex items-center gap-2">
            {hasSigned ? (
              <CheckCircle size={20} weight="fill" className="text-[#0080FF]" />
            ) : (
              <Clock size={20} className="text-[#53647A]" />
            )}
            <span className="text-sm font-medium text-[#001040]">
              Tanda Tangan Anda
            </span>
          </div>
          <div className="flex items-center gap-2">
            {otherPartySigned ? (
              <CheckCircle size={20} weight="fill" className="text-[#0080FF]" />
            ) : (
              <Clock size={20} className="text-[#53647A]" />
            )}
            <span className="text-sm font-medium text-[#001040]">
              Tanda Tangan {otherPartyRole}
            </span>
          </div>
        </div>

        {!hasSigned && (
          <form action={formAction}>
            <input type="hidden" name="projectId" value={projectId} />
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#001040] hover:bg-[#001040]/90 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {isPending ? "Memproses..." : "Tandatangani Perjanjian"}
            </button>
          </form>
        )}
      </div>

      {state?.ok === false && (
        <p className="mt-3 text-sm text-[#E11D48] font-medium">{state.message}</p>
      )}
    </div>
  );
}
