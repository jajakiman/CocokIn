"use client";

import { useState } from "react";
import { formatIdr } from "@/src/lib/money";
import {
  reconcilePaymentAction,
} from "@/src/adapters/payment/funding-actions";
import {
  executePayoutTransferAction,
} from "@/src/adapters/payment/payout-actions";
import {
  resolveDisputeAction,
} from "@/src/adapters/disputes/dispute-actions";
import {
  Bank,
  CheckCircle,
  CurrencyCircleDollar,
  ShieldCheck,
  Scales,
  Receipt,
  Ticket,
} from "@phosphor-icons/react";

export type AdminDashboardBalanceSheet = {
  cashAtBank: string;
  talentPayable: string;
  umkmRefundable: string;
  feePending: string;
  feeEarned: string;
  requiredReserve: string;
  isHealthy: boolean;
  coverageRatioPercent: number;
  reserveDeficit: string;
};

export type AdminDashboardData = {
  balanceSheet: AdminDashboardBalanceSheet;
  fundingReceipts: Array<{
    id: string;
    projectId: string;
    projectTitle: string;
    businessName: string;
    amountDue: string;
    amountReceived: string | null;
    status: string;
    platformReference: string | null;
    createdAt: string;
  }>;
  payoutInstructions: Array<{
    id: string;
    projectId: string;
    projectTitle: string;
    milestoneTitle: string;
    amount: string;
    status: string;
    platformReference: string | null;
    createdAt: string;
  }>;
  disputes: Array<{
    id: string;
    projectId: string;
    projectTitle: string;
    reason: string;
    status: string;
    evidenceCount: number;
    createdAt: string;
  }>;
  supportTickets: Array<{
    id: string;
    projectId: string;
    projectTitle: string;
    severity: string;
    status: string;
    description: string;
    createdAt: string;
  }>;
};

export function AdminDashboardView({ data }: { data: AdminDashboardData }) {
  const [activeTab, setActiveTab] = useState<"funding" | "payout" | "disputes" | "tickets">("funding");

  const bs = data.balanceSheet;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#001040] text-white p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#006FE6] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                Admin Operations
              </span>
              <span className="text-xs text-white/70">Farid — Platform Trust & Treasury</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Pusat Kendali Keuangan & Operasional</h1>
            <p className="text-sm text-white/80 mt-1">
              Pengawasan real-time neraca escrow, cadangan liabilitas 100%, rekonsiliasi kas, dan penyelesaian sengketa.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2.5 rounded-xl backdrop-blur-sm self-start md:self-auto">
            <ShieldCheck weight="fill" className="text-2xl text-[#31C48D]" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/60 block">Status Cadangan</span>
              <span className="text-sm font-bold text-white">
                {bs.isHealthy ? "100% Solven & Aman" : "Peringatan Defisit"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Balance Sheet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cash at Bank */}
        <div className="bg-white border border-[#D8E1EE] p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-[#53647A] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Kas Rekening Penampung</span>
            <Bank className="text-2xl text-[#006FE6]" />
          </div>
          <div className="text-2xl font-extrabold text-[#001040]">
            {formatIdr(BigInt(bs.cashAtBank))}
          </div>
          <div className="mt-2 text-xs text-[#059669] font-medium flex items-center gap-1">
            <CheckCircle weight="fill" /> Aset riil tersimpan di bank
          </div>
        </div>

        {/* Total Liabilities (Required Reserve) */}
        <div className="bg-white border border-[#D8E1EE] p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-[#53647A] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Liabilitas Pengguna</span>
            <CurrencyCircleDollar className="text-2xl text-[#E02424]" />
          </div>
          <div className="text-2xl font-extrabold text-[#001040]">
            {formatIdr(BigInt(bs.requiredReserve))}
          </div>
          <div className="mt-2 text-xs text-[#53647A] truncate">
            Talent: {formatIdr(BigInt(bs.talentPayable))} | Fee: {formatIdr(BigInt(bs.feePending))}
          </div>
        </div>

        {/* Earned Revenue */}
        <div className="bg-white border border-[#D8E1EE] p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-[#53647A] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Pendapatan Bersih Diakui</span>
            <Receipt className="text-2xl text-[#10B981]" />
          </div>
          <div className="text-2xl font-extrabold text-[#10B981]">
            {formatIdr(BigInt(bs.feeEarned))}
          </div>
          <div className="mt-2 text-xs text-[#53647A]">
            Activation & Success Fee yang telah dirampungkan
          </div>
        </div>

        {/* Reserve Ratio Invariant */}
        <div className="bg-white border border-[#D8E1EE] p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-[#53647A] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Rasio Cadangan (Invariant)</span>
            <ShieldCheck className="text-2xl text-[#006FE6]" />
          </div>
          <div className="text-2xl font-extrabold text-[#001040]">
            {bs.coverageRatioPercent}%
          </div>
          <div className="mt-2 text-xs font-semibold text-[#059669]">
            Target $\ge 100\%$ (ADR-0003 Patuh)
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#D8E1EE] gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("funding")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "funding"
              ? "border-[#006FE6] text-[#006FE6]"
              : "border-transparent text-[#53647A] hover:text-[#001040]"
          }`}
        >
          <Bank /> Meja Rekonsiliasi Pendanaan
          {data.fundingReceipts.filter((r) => r.status === "PROOF_SUBMITTED").length > 0 && (
            <span className="bg-[#FEF08A] text-[#854D0E] text-xs px-2 py-0.5 rounded-full font-bold">
              {data.fundingReceipts.filter((r) => r.status === "PROOF_SUBMITTED").length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payout")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "payout"
              ? "border-[#006FE6] text-[#006FE6]"
              : "border-transparent text-[#53647A] hover:text-[#001040]"
          }`}
        >
          <CurrencyCircleDollar /> Meja Eksekusi Payout
          {data.payoutInstructions.filter((p) => p.status === "PAYOUT_DUE").length > 0 && (
            <span className="bg-[#DEF7EC] text-[#03543F] text-xs px-2 py-0.5 rounded-full font-bold">
              {data.payoutInstructions.filter((p) => p.status === "PAYOUT_DUE").length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("disputes")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "disputes"
              ? "border-[#006FE6] text-[#006FE6]"
              : "border-transparent text-[#53647A] hover:text-[#001040]"
          }`}
        >
          <Scales /> Meja Sengketa & Putusan
          {data.disputes.filter((d) => d.status === "OPEN").length > 0 && (
            <span className="bg-[#FDE8E8] text-[#9B1C1C] text-xs px-2 py-0.5 rounded-full font-bold">
              {data.disputes.filter((d) => d.status === "OPEN").length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tickets")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "tickets"
              ? "border-[#006FE6] text-[#006FE6]"
              : "border-transparent text-[#53647A] hover:text-[#001040]"
          }`}
        >
          <Ticket /> Tiket Pemeliharaan
        </button>
      </div>

      {/* Tab 1: Funding Reconciliation Desk */}
      {activeTab === "funding" && (
        <div className="bg-white border border-[#D8E1EE] rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#D8E1EE]">
            <h2 className="text-lg font-bold text-[#001040]">Antrean Rekonsiliasi Pendanaan Proyek</h2>
            <p className="text-xs text-[#53647A] mt-0.5">
              Verifikasi mutasi rekening masuk sebelum mengaktifkan proyek ke status IN_PROGRESS.
            </p>
          </div>

          {data.fundingReceipts.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#53647A]">
              Tidak ada pembayaran yang membutuhkan verifikasi saat ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-[#53647A] text-xs font-bold uppercase border-b border-[#D8E1EE]">
                  <tr>
                    <th className="px-6 py-3">Proyek & UMKM</th>
                    <th className="px-6 py-3">Platform Reference</th>
                    <th className="px-6 py-3">Nominal Tagihan</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Aksi Finance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8E1EE]">
                  {data.fundingReceipts.map((receipt) => (
                    <tr key={receipt.id} className="hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4">
                        <strong className="text-[#001040] block">{receipt.projectTitle}</strong>
                        <span className="text-xs text-[#53647A]">{receipt.businessName}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[#53647A]">
                        {receipt.platformReference || "-"}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#001040]">
                        {formatIdr(BigInt(receipt.amountDue))}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            receipt.status === "FUNDED"
                              ? "bg-[#DEF7EC] text-[#03543F]"
                              : receipt.status === "PROOF_SUBMITTED"
                              ? "bg-[#FEF08A] text-[#854D0E]"
                              : "bg-[#E0E7FF] text-[#3730A3]"
                          }`}
                        >
                          {receipt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {receipt.status !== "FUNDED" ? (
                          <div className="flex justify-end gap-2">
                            <form
                              action={async (formData: FormData) => {
                                await reconcilePaymentAction(null, formData);
                              }}
                            >
                              <input type="hidden" name="projectId" value={receipt.projectId} />
                              <input type="hidden" name="approved" value="true" />
                              <button
                                type="submit"
                                className="bg-[#006FE6] hover:bg-[#006FE6]/90 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
                              >
                                Setujui & Rekonsiliasi
                              </button>
                            </form>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-[#059669] flex items-center justify-end gap-1">
                            <CheckCircle weight="fill" /> Lunas & Direkonsiliasi
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Payout Execution Desk */}
      {activeTab === "payout" && (
        <div className="bg-white border border-[#D8E1EE] rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#D8E1EE]">
            <h2 className="text-lg font-bold text-[#001040]">Antrean Eksekusi Payout ke Talent</h2>
            <p className="text-xs text-[#53647A] mt-0.5">
              Pencairan 90% hak kompensasi Talent untuk milestone yang telah di-approve oleh UMKM. Biaya transfer ditanggung CocokIn.
            </p>
          </div>

          {data.payoutInstructions.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#53647A]">
              Tidak ada antrean payout saat ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-[#53647A] text-xs font-bold uppercase border-b border-[#D8E1EE]">
                  <tr>
                    <th className="px-6 py-3">Milestone & Proyek</th>
                    <th className="px-6 py-3">Platform Reference</th>
                    <th className="px-6 py-3">Hak Bersih Talent (90%)</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Aksi Eksekusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8E1EE]">
                  {data.payoutInstructions.map((payout) => (
                    <tr key={payout.id} className="hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4">
                        <strong className="text-[#001040] block">{payout.milestoneTitle}</strong>
                        <span className="text-xs text-[#53647A]">{payout.projectTitle}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[#53647A]">
                        {payout.platformReference || "-"}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#006FE6]">
                        {formatIdr(BigInt(payout.amount))}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            payout.status === "PAID"
                              ? "bg-[#DEF7EC] text-[#03543F]"
                              : "bg-[#FEF08A] text-[#854D0E]"
                          }`}
                        >
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {payout.status === "PAYOUT_DUE" ? (
                          <form
                            action={async (formData: FormData) => {
                              await executePayoutTransferAction(null, formData);
                            }}
                          >
                            <input type="hidden" name="payoutInstructionId" value={payout.id} />
                            <button
                              type="submit"
                              className="bg-[#10B981] hover:bg-[#10B981]/90 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
                            >
                              Eksekusi Transfer (1-Klik)
                            </button>
                          </form>
                        ) : (
                          <span className="text-xs font-semibold text-[#059669] flex items-center justify-end gap-1">
                            <CheckCircle weight="fill" /> Selesai Dibayarkan
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Disputes Desk */}
      {activeTab === "disputes" && (
        <div className="bg-white border border-[#D8E1EE] rounded-xl overflow-hidden shadow-sm space-y-6 p-6">
          <div>
            <h2 className="text-lg font-bold text-[#001040]">Meja Resolusi Sengketa & Pembagian Retensi</h2>
            <p className="text-xs text-[#53647A] mt-0.5">
              Tinjau komplain dan putuskan alokasi 10% dana garansi yang dibekukan secara adil dan zero-sum.
            </p>
          </div>

          {data.disputes.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#53647A]">
              Tidak ada sengketa yang sedang aktif.
            </div>
          ) : (
            <div className="space-y-4">
              {data.disputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="border border-[#D8E1EE] rounded-xl p-5 space-y-4 bg-[#F8FAFC]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-[#53647A] uppercase">
                        Kasus Sengketa #{dispute.id.slice(-6)}
                      </span>
                      <h3 className="font-bold text-[#001040] text-base">{dispute.projectTitle}</h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                        dispute.status === "RESOLVED"
                          ? "bg-[#DEF7EC] text-[#03543F]"
                          : "bg-[#FDE8E8] text-[#9B1C1C]"
                      }`}
                    >
                      {dispute.status}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#D8E1EE] text-sm text-[#001040]">
                    <strong className="block text-xs text-[#53647A] mb-1">Alasan Komplain:</strong>
                    {dispute.reason}
                  </div>

                  {dispute.status !== "RESOLVED" && (
                    <form
                      action={async (formData: FormData) => {
                        await resolveDisputeAction(null, formData);
                      }}
                      className="space-y-3 pt-2"
                    >
                      <input type="hidden" name="disputeId" value={dispute.id} />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label className="p-3 border rounded-lg cursor-pointer bg-white hover:border-[#006FE6] flex items-center gap-2">
                          <input type="radio" name="resolution" value="FAVOR_TALENT" defaultChecked />
                          <div className="text-xs">
                            <strong className="block text-[#001040]">Menangkan Talent</strong>
                            <span className="text-[#53647A]">100% Retensi ke Talent</span>
                          </div>
                        </label>

                        <label className="p-3 border rounded-lg cursor-pointer bg-white hover:border-[#006FE6] flex items-center gap-2">
                          <input type="radio" name="resolution" value="FAVOR_UMKM" />
                          <div className="text-xs">
                            <strong className="block text-[#001040]">Menangkan UMKM</strong>
                            <span className="text-[#53647A]">100% Refund ke UMKM</span>
                          </div>
                        </label>

                        <label className="p-3 border rounded-lg cursor-pointer bg-white hover:border-[#006FE6] flex items-center gap-2">
                          <input type="radio" name="resolution" value="SPLIT" />
                          <div className="text-xs">
                            <strong className="block text-[#001040]">Bagi Dua (Split)</strong>
                            <span className="text-[#53647A]">50% Talent / 50% UMKM</span>
                          </div>
                        </label>
                      </div>

                      <textarea
                        name="notes"
                        required
                        placeholder="Catatan pertimbangan putusan Admin..."
                        className="w-full text-sm border border-[#D8E1EE] rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#006FE6]"
                        rows={2}
                      />

                      <button
                        type="submit"
                        className="bg-[#001040] hover:bg-[#001040]/90 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors"
                      >
                        Terapkan Putusan Sengketa
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Tickets Tab */}
      {activeTab === "tickets" && (
        <div className="bg-white border border-[#D8E1EE] rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#D8E1EE]">
            <h2 className="text-lg font-bold text-[#001040]">Tiket Pemeliharaan Masa Garansi 30 Hari</h2>
            <p className="text-xs text-[#53647A] mt-0.5">
              Memantau isu operasional UMKM selama garansi. Tiket aktif menahan pelepasan sisa dana retensi 10%.
            </p>
          </div>

          {data.supportTickets.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#53647A]">
              Tidak ada tiket pemeliharaan saat ini.
            </div>
          ) : (
            <div className="divide-y divide-[#D8E1EE]">
              {data.supportTickets.map((ticket) => (
                <div key={ticket.id} className="p-5 flex items-start justify-between gap-4 hover:bg-[#F8FAFC]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ticket.severity === "CRITICAL"
                            ? "bg-[#FDE8E8] text-[#9B1C1C]"
                            : ticket.severity === "MAJOR"
                            ? "bg-[#FEF08A] text-[#854D0E]"
                            : "bg-[#E0E7FF] text-[#3730A3]"
                        }`}
                      >
                        {ticket.severity}
                      </span>
                      <strong className="text-sm text-[#001040]">{ticket.projectTitle}</strong>
                    </div>
                    <p className="text-xs text-[#53647A]">{ticket.description}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      ticket.status === "RESOLVED"
                        ? "bg-[#DEF7EC] text-[#03543F]"
                        : "bg-[#FEF08A] text-[#854D0E]"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
