"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  { id: "q1", text: "Apakah bisnis Anda sudah memiliki pencatatan keuangan digital?", options: ["Belum", "Dalam Proses", "Sudah"] },
  { id: "q2", text: "Apakah Anda memiliki target pasar digital yang jelas?", options: ["Belum", "Sebagian", "Sudah"] },
  { id: "q3", text: "Seberapa siap tim Anda untuk mengadopsi teknologi baru?", options: ["Kurang Siap", "Cukup Siap", "Sangat Siap"] },
  { id: "q4", text: "Apakah Anda memiliki SOP (Standard Operating Procedure) operasional?", options: ["Tidak Ada", "Ada namun tidak lengkap", "Ada dan Lengkap"] },
  { id: "q5", text: "Apakah Anda pernah menggunakan jasa freelancer/talent sebelumnya?", options: ["Belum Pernah", "Pernah, tapi kurang puas", "Pernah dan Puas"] }
];

export default function BusinessAssessmentPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSelect = (qId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      alert("Harap jawab semua pertanyaan.");
      return;
    }
    
    setLoading(true);
    try {
      await fetch("/api/business/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      router.push("/business"); // Redirect to dashboard
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-[#D8E1EE]">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-[#001040]">
            Asesmen Kesiapan UMKM
          </h2>
          <p className="mt-2 text-center text-sm text-[#53647A]">
            Bantu kami memahami kesiapan bisnis Anda (5 Pilar) untuk mencocokkan Anda dengan talent terbaik.
          </p>
        </div>
        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <div key={q.id} className="space-y-4">
              <label className="block text-base font-medium text-[#001040]">
                {index + 1}. {q.text}
              </label>
              <div className="space-y-2">
                {q.options.map((opt) => (
                  <label key={opt} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleSelect(q.id, opt)}
                      className="h-4 w-4 text-[#0080FF] border-[#D8E1EE] focus:ring-[#0080FF]"
                    />
                    <span className="text-sm text-[#53647A]">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#001040] hover:bg-[#001040]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0080FF] disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Selesai & Mulai Eksplorasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
