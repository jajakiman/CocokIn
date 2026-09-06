import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";

export default async function AdminMessageReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const { reportId } = await params;
  const report = await prisma.messageReport.findUnique({ where: { id: reportId } });
  if (!report) redirect("/admin");

  await prisma.auditEvent.create({
    data: {
      action: "MESSAGE_REPORT_EVIDENCE_VIEWED",
      actorId: session.id,
      payload: { reportId: report.id, messageId: report.messageId },
    },
  });

  return (
    <main className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <Link href="/admin" className="text-sm font-bold text-[#006FE6] hover:underline">← Kembali ke konsol Admin</Link>
      <section className="bg-white border border-[#D8E1EE] rounded-xl p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-[#BE123C]">Bukti laporan pesan</p>
        <h1 className="text-2xl font-bold text-[#001040] mt-2">Konteks Pesan yang Dilaporkan</h1>
        <p className="text-sm text-[#53647A] mt-2">Akses bukti ini telah dicatat pada audit log.</p>
        <blockquote className="mt-6 rounded-lg border-l-4 border-[#9AABC2] bg-[#F1F5FB] p-4 text-[#001040] whitespace-pre-wrap">{report.messageContent}</blockquote>
        <dl className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
          <div><dt className="font-bold text-[#53647A]">Alasan laporan</dt><dd className="text-[#001040] mt-1">{report.reason}</dd></div>
          <div><dt className="font-bold text-[#53647A]">Pelapor</dt><dd className="text-[#001040] mt-1">{report.reporterName}</dd></div>
          <div><dt className="font-bold text-[#53647A]">Pengirim pesan</dt><dd className="font-mono text-[#001040] mt-1">{report.messageSenderId}</dd></div>
          <div><dt className="font-bold text-[#53647A]">Waktu pesan</dt><dd className="text-[#001040] mt-1">{report.messageCreatedAt.toLocaleString("id-ID")}</dd></div>
        </dl>
      </section>
    </main>
  );
}
