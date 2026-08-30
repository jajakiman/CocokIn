"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BusinessProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      industry: formData.get("industry"),
      description: formData.get("description"),
      city: formData.get("city"),
    };

    try {
      await fetch("/api/business/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      router.push("/business/assessment");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-[#D8E1EE]">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-[#001040]">
            Profil UMKM
          </h2>
          <p className="mt-2 text-center text-sm text-[#53647A]">
            Lengkapi data bisnis Anda untuk menemukan talent yang tepat.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#001040]">
                Nama Bisnis
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#D8E1EE] placeholder-[#53647A] text-[#001040] rounded-md focus:outline-none focus:ring-[#0080FF] focus:border-[#0080FF] sm:text-sm"
                placeholder="Misal: Kopi Kenangan"
              />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-[#001040]">
                Industri
              </label>
              <select
                id="industry"
                name="industry"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#D8E1EE] bg-white text-[#001040] rounded-md focus:outline-none focus:ring-[#0080FF] focus:border-[#0080FF] sm:text-sm"
              >
                <option value="">Pilih Industri</option>
                <option value="F&B">F&B</option>
                <option value="Retail">Retail</option>
                <option value="Jasa">Jasa</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-[#001040]">
                Kota/Kabupaten
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#D8E1EE] placeholder-[#53647A] text-[#001040] rounded-md focus:outline-none focus:ring-[#0080FF] focus:border-[#0080FF] sm:text-sm"
                placeholder="Misal: Jakarta Selatan"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#001040]">
                Deskripsi Singkat
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#D8E1EE] placeholder-[#53647A] text-[#001040] rounded-md focus:outline-none focus:ring-[#0080FF] focus:border-[#0080FF] sm:text-sm"
                placeholder="Ceritakan sedikit tentang bisnis Anda"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#001040] hover:bg-[#001040]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0080FF] disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Lanjutkan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
