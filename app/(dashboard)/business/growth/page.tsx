import { getSession } from "@/src/lib/session";
import { redirect } from "next/navigation";
import { PageHeader } from "@/src/design-system/page-header";
import { TrendUp, ChartLineUp } from "@phosphor-icons/react/dist/ssr";

export async function generateMetadata() {
  return { title: `Pertumbuhan Digital | CocokIn` };
}

export default async function BusinessGrowthPage() {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    redirect("/login");
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <PageHeader
        title="Pertumbuhan Digital"
        description="Pantau perkembangan bisnis Anda seiring selesainya proyek-proyek digital."
      />

      <div className="mt-8 bg-white border border-[#D8E1EE] p-12 rounded-xl text-center shadow-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#EAF3FF] text-[#006FE6] rounded-full mb-6">
          <TrendUp size={40} weight="bold" />
        </div>
        
        <h2 className="text-2xl font-bold text-[#001040] mb-4">
          Fitur Dalam Tahap Pengembangan
        </h2>
        
        <p className="text-[#53647A] max-w-2xl mx-auto leading-relaxed">
          Kami sedang menyiapkan analitik lengkap untuk mengukur peningkatan skor **Kesiapan Digital** (Digital Readiness) Anda setelah bekerja sama dengan Talent kami. 
          <br /><br />
          Nantinya, Anda bisa melihat dampak langsung proyek digital terhadap performa UMKM Anda!
        </p>

        <div className="mt-8 pt-8 border-t border-[#D8E1EE] flex justify-center gap-8">
          <div className="text-center">
            <div className="text-[#001040] font-bold text-xl">Metrik Sales</div>
            <div className="text-[#53647A] text-sm">Segera Hadir</div>
          </div>
          <div className="text-center border-l border-[#D8E1EE] pl-8">
            <div className="text-[#001040] font-bold text-xl">Efisiensi Operasional</div>
            <div className="text-[#53647A] text-sm">Segera Hadir</div>
          </div>
          <div className="text-center border-l border-[#D8E1EE] pl-8">
            <div className="text-[#001040] font-bold text-xl">Digital Footprint</div>
            <div className="text-[#53647A] text-sm">Segera Hadir</div>
          </div>
        </div>
      </div>
    </div>
  );
}
