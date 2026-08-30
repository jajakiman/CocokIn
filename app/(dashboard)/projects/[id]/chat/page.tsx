import { notFound } from "next/navigation";

export default async function ProjectChatPage({ params }: { params: Promise<{ id: string }> }) {
  // Chat feature will be implemented in Phase 5
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-4">
        <h1 className="text-[24px] font-bold text-[#001040]">Project Chat</h1>
        <p className="text-[14px] text-[#53647A]">
          Fitur chat akan segera hadir di Fase selanjutnya.
        </p>
      </div>
    </div>
  );
}
