import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { redirect } from "next/navigation";
import { PageHeader } from "@/src/design-system/page-header";
import { HandoverReviewPanel } from "@/src/components/infrastructure/handover-review-panel";

export async function generateMetadata() {
  return { title: `Review Handover Infrastruktur | CocokIn` };
}

export default async function BusinessHandoverPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolvedParams = await params;
  const projectId = resolvedParams.projectId;
  const session = await getSession();
  
  if (!session || session.role !== "BUSINESS") {
    redirect("/auth/login");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      businessProfile: true,
      infrastructureHandover: true
    }
  });

  if (!project || project.businessProfile.userId !== session.id) {
    redirect("/business/projects");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="Review Handover Infrastruktur" 
        description="Verifikasi hasil akhir proyek dari Talent sebelum penutupan" 
      />

      {!project.infrastructureHandover ? (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] p-6 rounded-xl text-center">
          <h2 className="text-xl font-bold text-[#B45309] mb-2">Belum Ada Handover</h2>
          <p className="text-[#92400E]">
            Talent belum mensubmit handover infrastruktur. Hal ini biasanya dilakukan setelah semua milestone selesai disetujui.
          </p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm">
          <h2 className="text-xl font-bold text-[#001040] mb-4">Detail Handover dari Talent</h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-[#53647A] block text-xs uppercase tracking-wider mb-1">Status Handover</span>
              <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                project.infrastructureHandover.status === "ACCEPTED" ? "bg-[#ECFDF5] text-[#059669]" :
                project.infrastructureHandover.status === "DISPUTED" ? "bg-[#FFF1F2] text-[#E11D48]" :
                "bg-[#FFFBEB] text-[#B45309]"
              }`}>
                {project.infrastructureHandover.status === "ACCEPTED" ? "Disetujui" : project.infrastructureHandover.status === "DISPUTED" ? "Bermasalah" : "Menunggu Review Anda"}
              </span>
            </div>
            
            <div>
              <span className="text-[#53647A] block text-xs uppercase tracking-wider mb-1">URL Produksi (Live)</span>
              <a href={project.infrastructureHandover.productionUrl} target="_blank" rel="noreferrer" className="text-[#006FE6] font-medium hover:underline inline-block bg-[#EFF6FF] px-3 py-2 rounded-lg border border-[#BFDBFE]">
                {project.infrastructureHandover.productionUrl}
              </a>
            </div>

            <div>
              <span className="text-[#53647A] block text-xs uppercase tracking-wider mb-2">Checklist Kesiapan</span>
              <ul className="space-y-2 border border-[#D8E1EE] rounded-lg p-4 bg-[#F8FAFC]">
                <li className="flex justify-between border-b border-dashed pb-2">
                  <span className="text-[#53647A]">Domain Terkonfigurasi:</span>
                  <span className="font-bold text-[#001040]">{(project.infrastructureHandover.checklistData as Record<string, boolean>)?.domainConfigured ? "Ya" : "Tidak"}</span>
                </li>
                <li className="flex justify-between border-b border-dashed pb-2">
                  <span className="text-[#53647A]">HTTPS Aktif:</span>
                  <span className="font-bold text-[#001040]">{(project.infrastructureHandover.checklistData as Record<string, boolean>)?.httpsActive ? "Ya" : "Tidak"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#53647A]">Source Code & Akses Diserahkan:</span>
                  <span className="font-bold text-[#001040]">{(project.infrastructureHandover.checklistData as Record<string, boolean>)?.sourceCodeTransferred ? "Ya" : "Tidak"}</span>
                </li>
              </ul>
            </div>
          </div>
          
          {project.infrastructureHandover.status === "PENDING" && (
            <HandoverReviewPanel projectId={project.id} />
          )}
        </div>
      )}
    </div>
  );
}
