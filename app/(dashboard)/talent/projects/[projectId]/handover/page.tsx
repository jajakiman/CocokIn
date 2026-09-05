import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { redirect } from "next/navigation";
import { PageHeader } from "@/src/design-system/page-header";
import { HandoverForm } from "@/src/components/infrastructure/handover-form";

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }) {
  return { title: `Handover Infrastruktur | CocokIn` };
}

export default async function TalentHandoverPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolvedParams = await params;
  const projectId = resolvedParams.projectId;
  const session = await getSession();
  
  if (!session || session.role !== "TALENT") {
    redirect("/auth/login");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      applications: { where: { talentProfile: { userId: session.id }, status: "ACCEPTED" } },
      milestones: true,
      handover: true
    }
  });

  if (!project || project.applications.length === 0) {
    redirect("/talent/projects");
  }

  const allMilestonesDone = project.milestones.every(m => m.status === "APPROVED" || m.status === "PAID" || m.status === "PAYOUT_DUE");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="Handover Infrastruktur" 
        subtitle="Serahkan akses dan kelengkapan proyek ke UMKM" 
      />

      {!allMilestonesDone ? (
        <div className="bg-[#FFF1F2] border border-[#FECDD3] p-6 rounded-xl text-center">
          <h2 className="text-xl font-bold text-[#E11D48] mb-2">Belum Tersedia</h2>
          <p className="text-[#9F1239]">
            Anda belum bisa melakukan handover karena masih ada milestone yang belum disetujui oleh UMKM. Selesaikan semua milestone terlebih dahulu.
          </p>
        </div>
      ) : project.handover ? (
        <div className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm">
          <h2 className="text-xl font-bold text-[#001040] mb-4">Status Handover</h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-[#53647A] block text-xs uppercase tracking-wider mb-1">Status</span>
              <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                project.handover.status === "ACCEPTED" ? "bg-[#ECFDF5] text-[#059669]" :
                project.handover.status === "DISPUTED" ? "bg-[#FFF1F2] text-[#E11D48]" :
                "bg-[#FFFBEB] text-[#B45309]"
              }`}>
                {project.handover.status === "ACCEPTED" ? "Disetujui" : project.handover.status === "DISPUTED" ? "Bermasalah" : "Menunggu Review UMKM"}
              </span>
            </div>
            
            <div>
              <span className="text-[#53647A] block text-xs uppercase tracking-wider mb-1">URL Produksi</span>
              <a href={project.handover.productionUrl} target="_blank" rel="noreferrer" className="text-[#006FE6] font-medium hover:underline">
                {project.handover.productionUrl}
              </a>
            </div>
          </div>
        </div>
      ) : (
        <HandoverForm projectId={project.id} />
      )}
    </div>
  );
}
