import { getSession } from "@/src/lib/session";
import { redirect } from "next/navigation";
import { CreateProjectForm } from "@/src/components/projects/create-project-form";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Buat Proyek Baru | CocokIn",
};

export default async function NewProjectPage() {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <Link href="/business" className="inline-flex items-center gap-2 text-[#53647A] hover:text-[#001040] transition-colors font-medium mb-4">
          <ArrowLeft weight="bold" /> Kembali ke Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-[#001040]">Buat Proyek Digital Baru</h1>
        <p className="text-[#53647A] mt-1">
          Jelaskan kebutuhan bisnis Anda, tentukan milestone, dan temukan Talent yang cocok.
        </p>
      </div>

      <CreateProjectForm />
    </div>
  );
}
