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
import { TalentSkillManager, type ManagedSkill } from "@/src/components/talent/talent-skill-manager";

type TalentProfileFormProps = {
  user: User & { talentProfile: TalentProfile | null };
  skills: ManagedSkill[];
};

export function TalentProfileForm({ user, skills }: TalentProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState<string>();

  const profile: Partial<TalentProfile> = user.talentProfile ?? {};
  const [careerTarget, setCareerTarget] = useState(profile.careerTarget || "");
  const names = (user.name ?? "").trim().split(/\s+/);
  const [firstName, setFirstName] = useState(names[0] ?? "");
  const [lastName, setLastName] = useState(names.slice(1).join(" "));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setToast(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName,
      lastName,
      bio: formData.get("bio"),
      university: formData.get("university"),
      major: formData.get("major"),
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
    <form aria-label="Edit profil Talent" className="space-y-6" onSubmit={handleSubmit}>
      {toast && (
        <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-4 rounded-xl flex items-center gap-3 text-[#059669]" role="status">
          <CheckCircle size={24} weight="fill" />
          <p className="font-bold">Profil berhasil diperbarui!</p>
        </div>
      )}
      {error ? <div className="rounded-xl border border-[#BE123C] bg-[#FFF1F2] p-4 text-sm text-[#9F1239]" role="alert">{error}</div> : null}

      {/* Akademik & Bio */}
      <section className="bg-white border border-[#D8E1EE] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#001040] mb-6 pb-2 border-b">Informasi Akademik & Bio</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-bold text-[#001040] mb-1">Nama Depan</label>
              <input id="firstName" name="firstName" type="text" required value={firstName} onChange={(event) => setFirstName(event.target.value)} className="w-full min-h-11 px-4 py-2 border border-[#D8E1EE] rounded-lg focus:outline-none focus:border-[#006FE6] focus:ring-1 focus:ring-[#006FE6]" />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-bold text-[#001040] mb-1">Nama Belakang</label>
              <input id="lastName" name="lastName" type="text" required value={lastName} onChange={(event) => setLastName(event.target.value)} className="w-full min-h-11 px-4 py-2 border border-[#D8E1EE] rounded-lg focus:outline-none focus:border-[#006FE6] focus:ring-1 focus:ring-[#006FE6]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="university" className="block text-sm font-bold text-[#001040] mb-1">Universitas</label>
              <input
                id="university"
                name="university"
                required
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
                required
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

      {/* Target Karier */}
      <section className="bg-white border border-[#D8E1EE] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#001040] mb-2">Target Karier</h2>
        <p className="mb-6 text-sm text-[#53647A]">Pilih jalur profesi untuk menyesuaikan asesmen dan rekomendasi proyek.</p>
        
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

        </div>
      </section>

      <section className="bg-white border border-[#D8E1EE] rounded-xl p-6 shadow-sm">
        <div className="mb-5 border-b border-[#D8E1EE] pb-4">
          <h2 className="text-xl font-bold text-[#001040]">Keahlian</h2>
          <p className="mt-1 text-sm text-[#53647A]">Kelola klaim keahlian untuk meningkatkan relevansi Cocok Score dan rekomendasi proyek.</p>
        </div>
        <TalentSkillManager compact skills={skills} showHeading={false} />
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
