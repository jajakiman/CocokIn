import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import { getOrCreateFundingInstruction } from "@/src/modules/payments/funding";
import { FundingView } from "@/src/components/payments/funding-view";

export async function generateMetadata() {
  return { title: "Pendanaan Proyek | CocokIn" };
}

export default async function ProjectFundingPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    redirect("/login");
  }

  const resolvedParams = await params;

  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.projectId },
    include: { businessProfile: true },
  });

  if (!project || project.businessProfile.userId !== session.id) {
    return <div className="p-8 text-center text-[#53647A]">Proyek tidak ditemukan atau akses ditolak.</div>;
  }

  const instructions = await getOrCreateFundingInstruction(project.id);

  return <FundingView initialDetails={instructions} />;
}
