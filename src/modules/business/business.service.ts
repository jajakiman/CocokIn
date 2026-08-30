import { prisma } from "@/src/adapters/database/prisma";
import { revalidatePath } from "next/cache";

export type UpdateBusinessProfileData = {
  businessName: string;
  industryCategory?: string | null;
  location?: string | null;
  description?: string | null;
};

/**
 * Updates an existing business profile.
 * Refactored to comply with Rafi's domain isolation rules.
 */
export async function updateBusinessProfile(
  userId: string,
  data: UpdateBusinessProfileData
) {
  // Check if profile exists
  const profile = await prisma.businessProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Business profile not found.");
  }

  const updatedProfile = await prisma.businessProfile.update({
    where: { userId },
    data: {
      businessName: data.businessName,
      industryCategory: data.industryCategory,
      location: data.location,
      description: data.description,
    },
  });

  // Revalidate relevant cache paths
  revalidatePath("/business/my-profile");
  
  return updatedProfile;
}
