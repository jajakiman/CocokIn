import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/src/design-system/page-header";
import { Buildings, MapPin, Briefcase, CheckCircle, ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export async function generateMetadata() {
  return { title: `Profil Usaha | CocokIn` };
}

export default async function BusinessProfileDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    redirect("/login");
  }

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: session.id },
    include: {
      assessments: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  if (!profile) {
    // If they haven't completed onboarding, send them there
    redirect("/business/profile");
  }

  const latestAssessment = profile.assessments[0];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Link href="/business" className="inline-flex items-center gap-2 text-[#53647A] font-medium hover:text-[#001040] transition-colors mb-4">
        <ArrowLeft weight="bold" /> Kembali ke Beranda
      </Link>

      <PageHeader
        title="Profil Usaha"
        description="Informasi mengenai profil UMKM Anda dan tingkat kesiapan digital."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-[#D8E1EE] rounded-xl p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#001040]">Detail Bisnis</h2>
                <span className="bg-[#ECFDF5] text-[#059669] px-3 py-1 rounded-full text-xs font-bold border border-[#A7F3D0]">
                  {profile.verificationStatus}
                </span>
              </div>
              <Link 
                href="/business/my-profile/edit"
                className="bg-[#F8FAFC] text-[#006FE6] border border-[#D8E1EE] px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#EAF3FF] transition-colors"
              >
                Edit Profil
              </Link>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[#53647A] flex items-center gap-2 mb-1">
                  <Buildings size={18} /> Nama Bisnis
                </h3>
                <p className="text-lg font-bold text-[#001040]">{profile.businessName}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#53647A] flex items-center gap-2 mb-1">
                  <Briefcase size={18} /> Kategori Industri
                </h3>
                <p className="text-[#001040]">{profile.industryCategory || "-"}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#53647A] flex items-center gap-2 mb-1">
                  <MapPin size={18} /> Lokasi
                </h3>
                <p className="text-[#001040]">{profile.location || "-"}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#53647A] mb-1">Deskripsi</h3>
                <p className="text-[#001040] whitespace-pre-line bg-[#F8FAFC] p-4 rounded-lg border border-[#D8E1EE]">
                  {profile.description || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#D8E1EE] rounded-xl p-6 shadow-sm text-center">
            <h3 className="text-sm font-semibold text-[#53647A] mb-4">Skor Kesiapan Digital</h3>
            
            <div className="w-32 h-32 mx-auto rounded-full border-8 flex items-center justify-center mb-4 
              border-[#006FE6] text-[#001040]">
              <span className="text-4xl font-black">
                {latestAssessment ? latestAssessment.readinessScore : "0"}
              </span>
            </div>

            {latestAssessment ? (
              <p className="text-sm text-[#059669] font-medium flex items-center justify-center gap-1">
                <CheckCircle weight="fill" /> Asesmen Selesai
              </p>
            ) : (
              <p className="text-sm text-[#E11D48] font-medium">
                Belum melakukan asesmen
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
