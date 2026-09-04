"use client";

import { ArrowRight, Sparkle, Storefront, Buildings, MapPin, Tag } from "@phosphor-icons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/design-system/select";
import { CocokInBrand } from "@/src/design-system/cocokin-brand";

const INDUSTRY_OPTIONS = [
  { id: "F&B", label: "F&B / Kuliner", desc: "Restoran, kafe, katering, makanan & minuman olahan" },
  { id: "Retail", label: "Retail & Toko", desc: "Toko kelontong, fashion, minimarket, distributor produk" },
  { id: "Jasa", label: "Jasa & Layanan", desc: "Laundry, salon, bengkel, reparasi, event organizer" },
  { id: "Agribisnis", label: "Agribisnis & Peternakan", desc: "Pertanian hidroponik, perkebunan, budidaya perikanan" },
  { id: "Kreatif", label: "Kreatif & Kerajinan", desc: "Kriya lokal, percetakan, konveksi, seni visual" },
  { id: "Teknologi", label: "Teknologi & Digital", desc: "Software house lokal, agensi periklanan, start-up awal" },
  { id: "Lainnya", label: "Sektor Usaha Lainnya", desc: "Kategori bisnis di luar daftar pilihan di atas" },
] as const;

type BusinessOnboardingWizardProps = {
  initialBusinessName?: string;
  initialIndustry?: string;
  initialCity?: string;
  initialDescription?: string;
};

export function BusinessOnboardingWizard({
  initialBusinessName = "",
  initialIndustry = "",
  initialCity = "",
  initialDescription = "",
}: BusinessOnboardingWizardProps) {
  const router = useRouter();
  const [name, setName] = useState(initialBusinessName);
  const [industry, setIndustry] = useState(initialIndustry);
  const [city, setCity] = useState(initialCity);
  const [description, setDescription] = useState(initialDescription);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (!name.trim()) {
      setError("Nama bisnis wajib diisi.");
      return;
    }
    if (!industry.trim()) {
      setError("Kategori industri bisnis wajib dipilih.");
      return;
    }
    if (!city.trim()) {
      setError("Kota / kabupaten domisili usaha wajib diisi.");
      return;
    }
    if (!description.trim()) {
      setError("Deskripsi singkat bisnis wajib diisi minimal 10 karakter.");
      return;
    }
    if (description.trim().length < 10) {
      setError("Deskripsi singkat bisnis terlalu pendek (minimal 10 karakter).");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/business/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          industry: industry.trim(),
          city: city.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan profil bisnis. Silakan coba lagi.");
      }

      router.push("/business/assessment");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setPending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#D8E1EE] bg-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,16,64,0.18)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-biz-title"
    >
      {/* Header Dialog */}
      <div className="flex items-center justify-between pb-5 border-b border-[#D8E1EE]">
        <div className="flex items-center gap-2.5">
          <CocokInBrand className="h-7 w-7 object-contain" decorative priority variant="mark" />
          <div>
            <h2 id="modal-biz-title" className="text-lg font-bold text-[#001040] leading-tight flex items-center gap-1.5">
              Profil Usaha UMKM
              <Sparkle className="text-[#FF8010]" size={16} weight="fill" />
            </h2>
            <p className="text-xs text-[#53647A]">Lengkapi data bisnis Anda untuk mulai memposting proyek digital.</p>
          </div>
        </div>
        <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF3FF] text-[#006FE6]">
          <Storefront size={20} weight="duotone" />
        </div>
      </div>

      {/* Form Area */}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Nama Bisnis */}
        <div>
          <label htmlFor="business-name" className="block text-xs font-bold uppercase tracking-wider text-[#001040] mb-1.5">
            Nama Bisnis <span className="text-[#BE123C] font-black" title="Wajib diisi">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9AABC2]">
              <Buildings size={18} />
            </span>
            <input
              id="business-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Kopi Kenangan Senja"
              className="w-full rounded-xl border border-[#D8E1EE] bg-[#F7F9FC] py-2.5 pl-10 pr-3 text-sm text-[#001040] placeholder:text-[#9AABC2] focus:border-[#006FE6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006FE6]/20 transition-all"
            />
          </div>
        </div>

        {/* Kategori Industri */}
        <div>
          <label htmlFor="business-industry" className="block text-xs font-bold uppercase tracking-wider text-[#001040] mb-1.5">
            Kategori Industri <span className="text-[#BE123C] font-black" title="Wajib diisi">*</span>
          </label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger
              id="business-industry"
              className="w-full rounded-xl border border-[#D8E1EE] bg-[#F7F9FC] py-2.5 px-3 text-sm text-[#001040] focus:border-[#006FE6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006FE6]/20 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-[#9AABC2] shrink-0" />
                <SelectValue placeholder="Pilih sektor industri bisnis Anda" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto rounded-xl border border-[#D8E1EE] bg-white p-1 shadow-lg">
              {INDUSTRY_OPTIONS.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.id}
                  className="cursor-pointer rounded-lg p-2.5 text-left text-sm hover:bg-[#EAF3FF] focus:bg-[#EAF3FF] transition-colors"
                >
                  <div className="font-semibold text-[#001040]">{item.label}</div>
                  <div className="text-xs text-[#53647A] line-clamp-1">{item.desc}</div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Kota / Kabupaten */}
        <div>
          <label htmlFor="business-city" className="block text-xs font-bold uppercase tracking-wider text-[#001040] mb-1.5">
            Kota / Kabupaten Domisili <span className="text-[#BE123C] font-black" title="Wajib diisi">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9AABC2]">
              <MapPin size={18} />
            </span>
            <input
              id="business-city"
              name="city"
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Misal: Bandung / Jakarta Selatan"
              className="w-full rounded-xl border border-[#D8E1EE] bg-[#F7F9FC] py-2.5 pl-10 pr-3 text-sm text-[#001040] placeholder:text-[#9AABC2] focus:border-[#006FE6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006FE6]/20 transition-all"
            />
          </div>
        </div>

        {/* Deskripsi Singkat */}
        <div>
          <label htmlFor="business-description" className="block text-xs font-bold uppercase tracking-wider text-[#001040] mb-1.5">
            Deskripsi Singkat Usaha <span className="text-[#BE123C] font-black" title="Wajib diisi">*</span>
          </label>
          <textarea
            id="business-description"
            name="description"
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ceritakan produk, target pelanggan, dan kendala operasional digital yang sedang dihadapi bisnis Anda..."
            className="w-full rounded-xl border border-[#D8E1EE] bg-[#F7F9FC] p-3 text-sm text-[#001040] placeholder:text-[#9AABC2] focus:border-[#006FE6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006FE6]/20 transition-all"
          />
          <p className="mt-1 text-[11px] text-[#53647A]">
            Minimal 10 karakter. Deskripsi ini membantu talent memahami model bisnis Anda.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl border border-[#FECDD3] bg-[#FFF1F2] p-3 text-xs font-semibold text-[#BE123C]" role="alert">
            {error}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#001040] hover:bg-[#001040]/90 !text-white px-5 py-3 text-sm font-bold shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <span>{pending ? "Menyimpan Data..." : "Lanjutkan ke Asesmen Kesiapan"}</span>
            {!pending && <ArrowRight size={16} weight="bold" />}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
