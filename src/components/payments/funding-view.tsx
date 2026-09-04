"use client";

import { useState, useActionState } from "react";
import { MoneyBreakdown } from "@/src/design-system/money-breakdown";
import { formatIdr } from "@/src/lib/money";
import type { FundingInstructionDetails, SupportedBank } from "@/src/modules/payments/funding/types";
import {
  submitPaymentProofAction,
  simulateInstantPaymentAction,
  type FundingActionState,
} from "@/src/adapters/payment/funding-actions";
import {
  Bank,
  QrCode,
  CheckCircle,
  Copy,
  Lightning,
} from "@phosphor-icons/react";
import Link from "next/link";

function getAccountNumber(bank: SupportedBank, projectId: string) {
  const prefixes: Record<SupportedBank, string> = {
    BCA: "88012",
    MANDIRI: "89012",
    BRI: "88812",
    BNI: "82012",
  };
  return `${prefixes[bank]}${projectId.replace(/\D/g, "").slice(-8).padStart(8, "12345678")}`;
}

export function FundingView({
  initialDetails,
}: {
  initialDetails: FundingInstructionDetails;
}) {
  const [method, setMethod] = useState<"BANK_TRANSFER" | "QRIS">(initialDetails.paymentMethod);
  const [selectedBank, setSelectedBank] = useState<SupportedBank>(initialDetails.bankName ?? "BCA");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [proofState, proofAction, isProofPending] = useActionState<FundingActionState, FormData>(
    submitPaymentProofAction,
    { ok: true, message: "" }
  );

  const [instantState, instantAction, isInstantPending] = useActionState<FundingActionState, FormData>(
    simulateInstantPaymentAction,
    { ok: true, message: "" }
  );

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  const isFunded = initialDetails.status === "FUNDED";
  const isProofSubmitted = initialDetails.status === "PROOF_SUBMITTED";
  const destinationAccount = getAccountNumber(selectedBank, initialDetails.projectId);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Simulation Banner */}
      <div className="bg-[#EFF6FF] border border-[#3B82F6]/30 text-[#1E40AF] p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Lightning weight="fill" className="text-[#3B82F6] text-2xl flex-shrink-0" />
          <div>
            <span className="font-bold text-sm block">Mode Simulasi Pembayaran (Staging/Demo)</span>
            <span className="text-xs text-[#1E40AF]/80">
              Transaksi ini disimulasikan secara aman tanpa memotong saldo uang riil.
            </span>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#3B82F6]/10 text-[#1D4ED8]">
          ADR-0002 Compliant
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#53647A]">
            Pendanaan Proyek Escrow
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isFunded
                ? "bg-[#DEF7EC] text-[#03543F]"
                : isProofSubmitted
                ? "bg-[#FEF08A] text-[#854D0E]"
                : "bg-[#E0E7FF] text-[#3730A3]"
            }`}
          >
            {isFunded
              ? "LUNAS & AKTIF"
              : isProofSubmitted
              ? "MENUNGGU REKONSILIASI"
              : "MENUNGGU PEMBAYARAN"}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#001040]">
          {initialDetails.projectTitle}
        </h1>
        <p className="text-sm text-[#53647A] mt-1">
          Platform Reference:{" "}
          <strong className="text-[#001040]">{initialDetails.platformReference}</strong>
        </p>
      </div>

      {/* Success Notification */}
      {isFunded && (
        <div className="bg-[#DEF7EC] border border-[#31C48D] text-[#03543F] p-6 rounded-xl flex items-start gap-4 shadow-sm">
          <CheckCircle weight="fill" className="text-2xl flex-shrink-0 mt-0.5 text-[#0E9F6E]" />
          <div>
            <h3 className="font-bold text-base">Pendanaan Telah Berhasil Direkonsiliasi!</h3>
            <p className="text-sm text-[#03543F]/90 mt-1">
              Dana telah aman dialokasikan ke cadangan liabilitas escrow. Status proyek Anda kini{" "}
              <strong>IN_PROGRESS</strong> dan Talent dapat mulai mengerjakan milestone.
            </p>
            <div className="mt-4">
              <Link
                href={`/business/projects/${initialDetails.projectId}`}
                className="inline-block bg-[#001040] hover:bg-[#001040]/90 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
              >
                Buka Ruang Kerja Proyek
              </Link>
            </div>
          </div>
        </div>
      )}

      {!isFunded && (
        <>
          {/* Method Switcher */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMethod("BANK_TRANSFER")}
              className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all text-left ${
                method === "BANK_TRANSFER"
                  ? "border-[#006FE6] bg-[#F0F7FF] text-[#001040]"
                  : "border-[#D8E1EE] bg-white text-[#53647A] hover:border-[#B4C6DF]"
              }`}
            >
              <Bank weight={method === "BANK_TRANSFER" ? "fill" : "regular"} className="text-2xl text-[#006FE6]" />
              <div>
                <span className="font-bold text-sm block">Virtual Account Bank</span>
                <span className="text-xs text-[#53647A]">BCA, Mandiri, BRI, BNI</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMethod("QRIS")}
              className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all text-left ${
                method === "QRIS"
                  ? "border-[#006FE6] bg-[#F0F7FF] text-[#001040]"
                  : "border-[#D8E1EE] bg-white text-[#53647A] hover:border-[#B4C6DF]"
              }`}
            >
              <QrCode weight={method === "QRIS" ? "fill" : "regular"} className="text-2xl text-[#006FE6]" />
              <div>
                <span className="font-bold text-sm block">GoPay Merchant QRIS</span>
                <span className="text-xs text-[#53647A]">Scan instan e-Wallet</span>
              </div>
            </button>
          </div>

          {/* Payment Instructions Card */}
          <div className="bg-white border border-[#D8E1EE] rounded-xl p-6 space-y-6 shadow-sm">
            {method === "BANK_TRANSFER" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {(["BCA", "MANDIRI", "BRI", "BNI"] as SupportedBank[]).map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${
                        selectedBank === bank
                          ? "bg-[#001040] text-white border-[#001040]"
                          : "bg-white text-[#53647A] border-[#D8E1EE] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      Bank {bank}
                    </button>
                  ))}
                </div>

                <div className="bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#53647A] block">Nomor Virtual Account {selectedBank}</span>
                      <span className="text-lg md:text-xl font-mono font-bold text-[#001040]">
                        {destinationAccount}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          destinationAccount,
                          "va"
                        )
                      }
                      className="px-3 py-1.5 rounded-lg border border-[#D8E1EE] text-xs font-semibold text-[#001040] hover:bg-white flex items-center gap-1.5"
                    >
                      <Copy /> {copiedField === "va" ? "Tersalin!" : "Salin"}
                    </button>
                  </div>

                  <div className="border-t border-[#D8E1EE] pt-2 flex items-center justify-between text-xs text-[#53647A]">
                    <span>Atas Nama:</span>
                    <strong className="text-[#001040]">PT COCOKIN TEKNOLOGI INDONESIA</strong>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#53647A]">
                    <span>Total Tagihan:</span>
                    <strong className="text-[#006FE6] font-bold text-sm">
                      {formatIdr(initialDetails.fundingDue)}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {method === "QRIS" && (
              <div className="text-center py-4 space-y-4">
                <div className="inline-block p-4 bg-white border-2 border-[#D8E1EE] rounded-xl shadow-inner">
                  {/* QR Code Dummy Box */}
                  <div className="w-48 h-48 bg-[#F1F5F9] border border-dashed border-[#94A3B8] rounded-lg flex flex-col items-center justify-center p-4">
                    <QrCode className="text-6xl text-[#001040]" />
                    <span className="text-[10px] text-[#53647A] mt-2 font-mono break-all">
                      {initialDetails.platformReference}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-bold text-[#001040] block">
                    Simulasi QRIS via GoPay, OVO, Dana, atau Mobile Banking
                  </span>
                  <span className="text-xs text-[#53647A]">
                    Gunakan referensi QRIS di atas untuk simulasi sebesar <strong>{formatIdr(initialDetails.fundingDue)}</strong> (tanpa uang riil)
                  </span>
                </div>
              </div>
            )}

            {/* Transparent Financial Breakdown */}
            <div className="border-t border-[#D8E1EE] pt-6">
              <MoneyBreakdown
                serviceValue={Number(initialDetails.serviceValue)}
                role="business"
                platformFeePercent={10}
              />
            </div>
          </div>

          {/* Action Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Upload Bukti Transfer */}
            <div className="bg-white border border-[#D8E1EE] rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-[#001040] text-base">Konfirmasi Bukti Transfer</h3>
              <p className="text-xs text-[#53647A]">
                Kirim data transfer Anda agar tim Finance dapat memverifikasi rekonsiliasi dana.
              </p>

              <form action={proofAction} className="space-y-3">
                <input type="hidden" name="projectId" value={initialDetails.projectId} />
                <input type="hidden" name="amountTransferred" value={initialDetails.fundingDue.toString()} />
                <input type="hidden" name="paymentMethod" value={method} />
                {method === "BANK_TRANSFER" ? (
                  <>
                    <input type="hidden" name="destinationBank" value={selectedBank} />
                  </>
                ) : null}

                {method === "BANK_TRANSFER" ? <div>
                  <label className="text-xs font-semibold text-[#53647A] block mb-1">
                    Bank Pengirim
                  </label>
                  <input
                    name="senderBank"
                    defaultValue={selectedBank}
                    required
                    className="w-full text-sm border border-[#D8E1EE] rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#006FE6]"
                    placeholder="Contoh: BCA, Mandiri"
                  />
                </div> : null}

                {method === "BANK_TRANSFER" ? <div>
                  <label className="text-xs font-semibold text-[#53647A] block mb-1">
                    Nomor Rekening Pengirim
                  </label>
                  <input
                    name="senderAccount"
                    required
                    className="w-full text-sm border border-[#D8E1EE] rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#006FE6]"
                    placeholder="Contoh: 1234567890"
                  />
                </div> : null}

                <div>
                  <label className="text-xs font-semibold text-[#53647A] block mb-1">
                    {method === "BANK_TRANSFER" ? "Nama Pemilik Rekening" : "Nama Pembayar QRIS"}
                  </label>
                  <input
                    name="senderName"
                    required
                    className="w-full text-sm border border-[#D8E1EE] rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#006FE6]"
                    placeholder={method === "BANK_TRANSFER" ? "Nama sesuai buku tabungan" : "Nama akun pembayaran"}
                  />
                </div>

                {method === "QRIS" ? (
                  <div>
                    <label className="text-xs font-semibold text-[#53647A] block mb-1">
                      Referensi Transaksi / RRN
                    </label>
                    <input
                      name="paymentReference"
                      required
                      minLength={6}
                      className="w-full text-sm border border-[#D8E1EE] rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#006FE6]"
                      placeholder="Contoh: QRIS-RRN-9081726354"
                    />
                  </div>
                ) : null}

                {proofState.message && (
                  <div
                    className={`p-3 rounded-lg text-xs ${
                      proofState.ok
                        ? "bg-[#DEF7EC] text-[#03543F] border border-[#31C48D]"
                        : "bg-[#FDE8E8] text-[#9B1C1C] border border-[#F98080]"
                    }`}
                  >
                    {proofState.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProofPending}
                  className="w-full bg-[#001040] hover:bg-[#001040]/90 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {isProofPending ? "Mengirim Bukti..." : "Kirim Bukti Pembayaran"}
                </button>
              </form>
            </div>

            {/* Instant Demo Sandbox Area */}
            <div className="bg-[#F8FAFC] border-2 border-dashed border-[#006FE6]/40 rounded-xl p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#006FE6]/10 text-[#006FE6] text-xs font-bold mb-2">
                  <Lightning weight="fill" /> Sandbox Pengujian Cepat
                </div>
                <h3 className="font-bold text-[#001040] text-base">Simulasikan Pembayaran Instan</h3>
                <p className="text-xs text-[#53647A] mt-1 leading-relaxed">
                  Gunakan tombol ini untuk memicu penyelesaian pendanaan dan rekonsiliasi finance secara otomatis dalam satu klik.
                  Proyek akan langsung berpindah status menjadi <strong>IN_PROGRESS</strong> dan ledger akan dicatat.
                </p>
              </div>

              <form action={instantAction} className="pt-4">
                <input type="hidden" name="projectId" value={initialDetails.projectId} />
                {instantState.message && (
                  <div
                    className={`p-3 rounded-lg text-xs mb-3 ${
                      instantState.ok
                        ? "bg-[#DEF7EC] text-[#03543F] border border-[#31C48D]"
                        : "bg-[#FDE8E8] text-[#9B1C1C] border border-[#F98080]"
                    }`}
                  >
                    {instantState.message}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isInstantPending}
                  className="w-full bg-[#006FE6] hover:bg-[#006FE6]/90 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lightning weight="fill" />
                  {isInstantPending ? "Memproses Simulasi..." : "⚡ Simulasikan Pembayaran Berhasil (1-Klik)"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
