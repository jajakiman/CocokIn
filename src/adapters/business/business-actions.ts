"use server";

import { getSession } from "@/src/lib/session";
import { updateBusinessProfile } from "@/src/modules/business/business.service";

export type ActionState = {
  ok: boolean;
  message: string;
};

export async function updateBusinessProfileAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await getSession();

    if (!session || session.role !== "BUSINESS") {
      return { ok: false, message: "Unauthorized. Harus login sebagai UMKM." };
    }

    const businessName = formData.get("businessName")?.toString();
    const industryCategory = formData.get("industryCategory")?.toString();
    const location = formData.get("location")?.toString();
    const description = formData.get("description")?.toString();

    if (!businessName) {
      return { ok: false, message: "Nama bisnis wajib diisi." };
    }

    await updateBusinessProfile(session.id, {
      businessName,
      industryCategory,
      location,
      description,
    });

    return { ok: true, message: "Profil berhasil diperbarui!" };
  } catch (error: any) {
    console.error("Failed to update business profile:", error);
    return { ok: false, message: error.message || "Terjadi kesalahan internal." };
  }
}
