"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react";
import type { TalentProfile, User } from "@prisma/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/design-system/select";
import { careerTargets } from "@/src/modules/talent/profile";

type TalentProfileFormProps = {
  user: User & { talentProfile: TalentProfile | null };
};

export function TalentProfileForm({ user }: TalentProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState<string>();

  const profile: Partial<TalentProfile> = user.talentProfile ?? {};
  const [workMode, setWorkMode] = useState(profile.workModePreference || "REMOTE");
  const [timeAvailability, setTimeAvailability] = useState(profile.timeAvailability || "PART_TIME");
  const [careerTarget, setCareerTarget] = useState(profile.careerTarget || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setToast(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      bio: formData.get("bio"),
      university: formData.get("university"),
      major: formData.get("major"),
      workModePreference: workMode,
      timeAvailability: timeAvailability,
      careerTarget,
    };

    try {
      const response = await fetch("/api/talent/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({ message: "Profil tidak dapat disimpan." }));
      if (!response.ok) {
        setError(result.message);
        return;
      }
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Terjadi kendala jaringan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {toast && (
        <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-4 rounded-xl flex items-center gap-3 text-[#059669]">
          <CheckCircle size={24} weight="fill" />
          <p className="font-bold">Profil berhasil diperbarui!</p>
        </div>
      )}
      {error ? <div className="rounded-xl border border-[#BE123C] bg-[#FFF1F2] p-4 text-sm text-[#9F1239]" role="alert">{error}</div> : null}

      {/* Akademik & Bio */}
      <section className="bg-white border border-[#D8E1EE] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#001040] mb-6 pb-2 border-b">Informasi Akademik & Bio</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-[#001040] mb-1">Nama Lengkap</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={user.name || ""}
              className="w-full px-4 py-2 border border-[#D8E1EE] rounded-lg focus:outline-none focus:border-[#006FE6] focus:ring-1 focus:ring-[#006FE6]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="university" className="block text-sm font-bold text-[#001040] mb-1">Universitas</label>
              <input
                id="university"
                name="university"
                type="text"
                defaultValue={profile.university || ""}
                className="w-full px-4 py-2 border border-[#D8E1EE] rounded-lg focus:outline-none focus:border-[#006FE6]"
              />
            </div>
            <div>
              <label htmlFor="major" className="block text-sm font-bold text-[#001040] mb-1">Jurusan</label>
              <input
                id="major"
                name="major"
                type="text"
                defaultValue={profile.major || ""}
                className="w-full px-4 py-2 border border-[#D8E1EE] rounded-lg focus:outline-none focus:border-[#006FE6]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-bold text-[#001040] mb-1">Bio Ringkas</label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={profile.bio || ""}
              className="w-full px-4 py-2 border border-[#D8E1EE] rounded-lg focus:outline-none focus:border-[#006FE6]"
            />
          </div>
        </div>
      </section>

      {/* Target Karier & Preferensi */}
      <section className="bg-white border border-[#D8E1EE] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#001040] mb-6 pb-2 border-b">Target Karier & Sistem Kerja</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="careerTarget" className="block text-sm font-bold text-[#001040] mb-1">Target Karier</label>
            <Select onValueChange={setCareerTarget} value={careerTarget}>
              <SelectTrigger id="careerTarget"><SelectValue placeholder="Pilih target karier" /></SelectTrigger>
              <SelectContent>
                {careerTargets.map((target) => <SelectItem key={target} value={target}>{target}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#001040] mb-1">Preferensi Mode Kerja</label>
              <Select value={workMode} onValueChange={setWorkMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Mode Kerja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REMOTE">Remote (Jarak Jauh - Disarankan)</SelectItem>
                  <SelectItem value="HYBRID">Hybrid (Fleksibel)</SelectItem>
                  <SelectItem value="ONSITE">Onsite (Di Lokasi)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#001040] mb-1">Ketersediaan Waktu</label>
              <Select value={timeAvailability} onValueChange={setTimeAvailability}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Ketersediaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="PART_TIME">Part Time (Paruh Waktu)</SelectItem>
                  <SelectItem value="WEEKEND">Weekend Only (Akhir Pekan)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#001040] hover:bg-[#001040]/90 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
