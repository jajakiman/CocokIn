import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/src/design-system/page-header";
import { EditBusinessProfileForm } from "@/src/components/business/edit-profile-form";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export async function generateMetadata() {
  return { title: `Edit Profil Usaha | CocokIn` };
}

export default async function EditBusinessProfilePage() {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    redirect("/login");
  }

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: session.id },
  });

  if (!profile) {
    redirect("/business/profile");
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <Link href="/business/my-profile" className="inline-flex items-center gap-2 text-[#53647A] font-medium hover:text-[#001040] transition-colors mb-4">
        <ArrowLeft weight="bold" /> Kembali ke Detail Profil
      </Link>

      <PageHeader
        title="Edit Profil Usaha"
        description="Perbarui informasi mengenai UMKM Anda."
      />

      <div className="mt-8">
        <EditBusinessProfileForm profile={profile} />
      </div>
    </div>
  );
}
