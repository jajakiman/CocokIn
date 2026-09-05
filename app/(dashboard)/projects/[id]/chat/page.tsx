import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/src/modules/chat/components/ChatInterface";
import { getConversationByProjectId, createConversation } from "@/src/modules/chat/chat.service";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default async function ProjectChatPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      applications: {
        where: { status: "ACCEPTED" },
        include: { talentProfile: true }
      }
    }
  });

  if (!project) redirect("/");

  // Determine if user has access (either the UMKM or the accepted Talent)
  const isUMKM = project.businessProfileId === (await prisma.businessProfile.findUnique({ where: { userId: session.id } }))?.id;
  const acceptedTalent = project.applications[0];
  const isTalent = acceptedTalent?.talentProfile.userId === session.id;

  if (!isUMKM && !isTalent) {
    redirect("/");
  }

  // Ensure conversation exists
  let conversation = await getConversationByProjectId(projectId);
  
  if (!conversation) {
    if (!acceptedTalent) redirect("/"); // Cannot create conversation if no talent is accepted yet
    conversation = await createConversation(
      projectId, 
      acceptedTalent.talentProfile.userId, 
      (await prisma.businessProfile.findUnique({ where: { id: project.businessProfileId } }))!.userId
    );
    // Refetch to get participants and messages shape
    conversation = await getConversationByProjectId(projectId);
  }

  if (!conversation) redirect("/");

  const initialMessages = conversation.messages.map(m => ({
    id: m.id,
    senderId: m.senderId,
    content: m.content || "",
    isSystemMessage: m.isSystemMessage,
    createdAt: m.createdAt.toISOString(),
    attachments: m.attachments.map(a => ({ fileUrl: a.fileUrl, fileType: a.fileType }))
  }));

  const backUrl = session.role === "BUSINESS" 
    ? `/business/projects/${projectId}` 
    : `/talent/projects/${projectId}/workspace`;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-4">
        <Link href={backUrl} className="inline-flex items-center gap-2 text-[#53647A] hover:text-[#001040] transition-colors font-medium mb-2">
          <ArrowLeft weight="bold" /> Kembali
        </Link>
        <h1 className="text-[24px] font-bold text-[#001040]">Ruang Chat: {project.title}</h1>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ChatInterface 
          conversationId={conversation.id}
          currentUserId={session.id}
          initialMessages={initialMessages}
        />
      </div>
    </div>
  );
}
