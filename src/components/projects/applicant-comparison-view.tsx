"use client";

import { useState } from "react";
import { Lightning, X } from "@phosphor-icons/react";
import { AcceptTalentForm } from "@/src/components/projects/accept-talent-form";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type ApplicationWithRelations = {
  id: string;
  status: string;
  motivation: string | null;
  projectId: string;
  talentProfile: {
    university: string | null;
    user: {
      name: string | null;
    };
    skills: {
      skill: {
        name: string;
      }
    }[];
  };
  matchSnapshot: {
    cocokScore: number;
    skillMatchScore: number;
    careerAlignmentScore: number;
    availabilityScore: number;
    experienceScore: number;
    preferenceScore: number;
    explainableText: string | null;
  } | null;
};

export function ApplicantComparisonView({
  applications,
  isSelected
}: {
  applications: ApplicationWithRelations[];
  isSelected: boolean;
}) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const selectedApp = applications.find(a => a.id === selectedAppId);

  if (applications.length === 0) {
    return (
      <div className="col-span-full p-12 text-center border rounded-xl bg-white text-[#53647A]">
        Belum ada Talent yang melamar proyek ini.
      </div>
    );
  }

  return (
    <>
      {/* DESKTOP VIEW: Table */}
      <div className="hidden lg:block overflow-x-auto bg-white border border-[#D8E1EE] rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#D8E1EE]">
              <th className="p-4 font-bold text-[#001040] w-1/4">Talent</th>
              <th className="p-4 font-bold text-[#001040] text-center w-24">Cocok Score</th>
              <th className="p-4 font-bold text-[#001040] w-1/4">Alasan Melamar</th>
              <th className="p-4 font-bold text-[#001040]">Keahlian (Top 4)</th>
              <th className="p-4 font-bold text-[#001040] text-center w-40">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8E1EE]">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                <td className="p-4 align-top">
                  <div className="font-bold text-[#001040]">{app.talentProfile.user.name || "Talent Anonim"}</div>
                  <div className="text-sm text-[#53647A] mt-1">{app.talentProfile.university || "Universitas tidak diketahui"}</div>
                </td>
                <td className="p-4 align-top text-center">
                  <div className="inline-flex bg-[#EAF3FF] text-[#006FE6] font-bold px-3 py-1.5 rounded-lg items-center gap-1">
                    <Lightning weight="fill" /> {app.matchSnapshot?.cocokScore || 0}%
                  </div>
                </td>
                <td className="p-4 align-top">
                  <div className="text-sm text-[#001040] italic line-clamp-3 bg-[#F8FAFC] p-2 rounded-lg border">
                    "{app.motivation || "Tidak ada motivasi tambahan."}"
                  </div>
                </td>
                <td className="p-4 align-top">
                  <div className="flex flex-wrap gap-2">
                    {app.talentProfile.skills.slice(0, 4).map((ts, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md border">
                        {ts.skill.name}
                      </span>
                    ))}
                    {app.talentProfile.skills.length > 4 && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md border">+{app.talentProfile.skills.length - 4} lagi</span>
                    )}
                  </div>
                </td>
                <td className="p-4 align-top text-center">
                  {app.status === "ACCEPTED" ? (
                    <div className="bg-[#ECFDF5] text-[#059669] text-center font-bold py-2 rounded-lg border border-[#059669]">
                      Terpilih!
                    </div>
                  ) : app.status === "REJECTED" ? (
                    <div className="bg-[#F1F5F9] text-[#64748B] text-center font-medium py-2 rounded-lg border border-[#CBD5E1]">
                      Tidak Terpilih
                    </div>
                  ) : !isSelected ? (
                    <Link 
                      href={`/business/projects/${app.projectId}/agreement/${app.id}`}
                      className="block w-full bg-[#001040] hover:bg-[#001040]/90 !text-white text-center font-bold py-2 rounded-lg transition-colors"
                    >
                      Pilih Talent Ini
                    </Link>
                  ) : (
                    <div className="bg-[#F1F5F9] text-[#64748B] text-center font-medium py-2 rounded-lg border border-[#CBD5E1]">
                      Selesai
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW: Stacked Records */}
      <div className="lg:hidden flex flex-col gap-4">
        {applications.map((app) => (
          <div 
            key={app.id} 
            onClick={() => setSelectedAppId(app.id)}
            className="border border-[#D8E1EE] rounded-xl bg-white p-4 cursor-pointer hover:shadow-md transition-shadow flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-[#001040]">{app.talentProfile.user.name || "Talent Anonim"}</h2>
                <p className="text-[#53647A] text-xs mt-0.5">{app.talentProfile.university}</p>
              </div>
              <div className="bg-[#EAF3FF] text-[#006FE6] font-bold text-sm px-2 py-1 rounded-md flex items-center gap-1 shrink-0">
                <Lightning weight="fill" /> {app.matchSnapshot?.cocokScore || 0}%
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {app.talentProfile.skills.slice(0, 3).map((ts, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded border">
                  {ts.skill.name}
                </span>
              ))}
              {app.talentProfile.skills.length > 3 && (
                <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded border">+{app.talentProfile.skills.length - 3}</span>
              )}
            </div>

            <div className="text-xs text-[#0080FF] font-medium mt-1">Tap untuk membandingkan details &rarr;</div>
          </div>
        ))}
      </div>

      {/* MOBILE COMPARISON SHEET (Bottom Sheet Modal) */}
      <AnimatePresence>
        {selectedAppId && selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 lg:hidden p-2"
          >
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setSelectedAppId(null)} />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-2xl p-6 w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col"
            >
              <button 
                onClick={() => setSelectedAppId(null)}
                className="absolute top-4 right-4 text-[#53647A] hover:bg-gray-100 p-2 rounded-full"
              >
                <X size={24} />
              </button>
              
              <div className="flex justify-between items-start mb-6 pr-8">
                <div>
                  <h2 className="font-bold text-xl text-[#001040]">{selectedApp.talentProfile.user.name || "Talent Anonim"}</h2>
                  <p className="text-[#53647A] text-sm mt-1">{selectedApp.talentProfile.university}</p>
                </div>
                <div className="bg-[#EAF3FF] text-[#006FE6] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0">
                  <Lightning weight="fill" /> {selectedApp.matchSnapshot?.cocokScore || 0}%
                </div>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-xs font-bold text-[#53647A] uppercase tracking-wider mb-2">Alasan Melamar</h4>
                  <p className="text-sm text-[#001040] italic bg-[#F8FAFC] p-4 rounded-xl border">
                    "{selectedApp.motivation || "Tidak ada motivasi tambahan."}"
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#53647A] uppercase tracking-wider mb-2">Semua Keahlian</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.talentProfile.skills.map((ts, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md border">
                        {ts.skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedApp.matchSnapshot?.explainableText && (
                  <div>
                    <h4 className="text-xs font-bold text-[#53647A] uppercase tracking-wider mb-2">Analisis CocokIn</h4>
                    <p className="text-sm text-[#001040] bg-[#FFFBEB] p-4 rounded-xl border border-[#FDE68A]">
                      {selectedApp.matchSnapshot.explainableText}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-[#D8E1EE]">
                {selectedApp.status === "ACCEPTED" ? (
                  <div className="bg-[#ECFDF5] text-[#059669] text-center font-bold py-3 rounded-xl border border-[#059669]">
                    Talent ini Terpilih!
                  </div>
                ) : selectedApp.status === "REJECTED" ? (
                  <div className="bg-[#F1F5F9] text-[#64748B] text-center font-medium py-3 rounded-xl border border-[#CBD5E1]">
                    Tidak Terpilih
                  </div>
                ) : !isSelected ? (
                  <Link 
                    href={`/business/projects/${selectedApp.projectId}/agreement/${selectedApp.id}`}
                    className="block w-full bg-[#001040] hover:bg-[#001040]/90 !text-white text-center font-bold py-3 rounded-xl transition-colors"
                  >
                    Pilih Talent Ini
                  </Link>
                ) : (
                  <div className="bg-[#F1F5F9] text-[#64748B] text-center font-medium py-3 rounded-xl border border-[#CBD5E1]">
                    Selesai (Talent Lain Telah Dipilih)
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
