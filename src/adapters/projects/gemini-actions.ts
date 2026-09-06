"use server";

import { GoogleGenAI } from "@google/genai";
import { getSession } from "@/src/lib/session";

export type GenerateScopeResult = {
  ok: boolean;
  data?: {
    title: string;
    scope: string;
    estimatedDays: number;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    infrastructureNeed: string;
    skills: string[];
    milestones: { title: string; weightBps: number; acceptanceCriteria: string[] }[];
  };
  message?: string;
};

export async function generateProjectScopeAction(prompt: string): Promise<GenerateScopeResult> {
  const session = await getSession();
  if (!session || session.role !== "BUSINESS") {
    return { ok: false, message: "Unauthorized. Hanya UMKM yang dapat membuat proyek." };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Fallback if API key is not configured (e.g. on Vercel preview)
    console.warn("GEMINI_API_KEY is not set. Using simulated response.");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      ok: true,
      data: {
        title: "Pembuatan Website UMKM",
        scope: "Website company profile dengan fitur katalog produk sederhana. Dibutuhkan desain yang responsif dan integrasi dengan sistem kontak WhatsApp.",
        estimatedDays: 14,
        difficulty: "INTERMEDIATE",
        infrastructureNeed: "MANAGED_HOSTING",
        skills: ["React", "Tailwind CSS", "UI/UX Design"],
        milestones: [
          {
            title: "Desain UI/UX",
            weightBps: 3000,
            acceptanceCriteria: ["Wireframe disetujui", "Desain Hi-Fi selesai (Figma)"]
          },
          {
            title: "Implementasi Frontend & Deployment",
            weightBps: 7000,
            acceptanceCriteria: ["Website live di staging", "Responsive di mobile dan desktop", "Lolos uji kecepatan muat dasar"]
          }
        ]
      }
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert product manager and technical architect for CocokIn.
The user wants to build the following idea: "${prompt}".

Generate a structured JSON response to auto-fill a project creation form.
The JSON must perfectly match this structure:
{
  "title": "A short, professional title (max 50 chars)",
  "scope": "Detailed project scope/requirements based on the user's idea.",
  "estimatedDays": 14,
  "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
  "infrastructureNeed": "MANAGED_HOSTING" | "STAGING_ONLY" | "SHARED_HOSTING" | "VPS" | "EXISTING_INFRASTRUCTURE",
  "skills": ["React", "Copywriting", "etc (max 5)"],
  "milestones": [
    {
      "title": "Milestone Title",
      "weightBps": 5000, // Important: This represents percentage * 100. (e.g., 50% = 5000). Total of all milestones must be EXACTLY 10000.
      "acceptanceCriteria": ["criterion 1", "criterion 2"]
    }
  ]
}

Make sure there are between 2 to 4 milestones, and the total weightBps MUST sum exactly to 10000. Keep it realistic for freelancers.`,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    // Sanitize any stray markdown wrappers (e.g. ```json ... ```)
    let rawText = response.text.trim();
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    }

    const data = JSON.parse(rawText);

    // Normalize milestone weights so they strictly sum to 10000 bps
    if (Array.isArray(data.milestones) && data.milestones.length > 0) {
      const currentSum = data.milestones.reduce((acc: number, m: { weightBps?: number }) => acc + (Number(m.weightBps) || 0), 0);
      if (currentSum !== 10000 && currentSum > 0) {
        const lastIndex = data.milestones.length - 1;
        const diff = 10000 - currentSum;
        data.milestones[lastIndex].weightBps = (Number(data.milestones[lastIndex].weightBps) || 0) + diff;
      }
    }

    return {
      ok: true,
      data
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { ok: false, message: "Terjadi kesalahan saat menghubungi AI. Silakan coba lagi nanti." };
  }
}
