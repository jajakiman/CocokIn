import {
  cloneSeed,
  SEED_METADATA,
  type SeedBusinessProfile,
  type SeededRecord,
} from "./types";

export const SEEDED_BUSINESS_PROFILE: SeededRecord<SeedBusinessProfile> = {
  id: "business-warung-siti",
  name: "Warung Bu Siti",
  category: "Kuliner",
  city: "Bandung",
  description: "Warung makan sintetis yang ingin menyederhanakan katalog dan pemesanan digital.",
  verificationStatus: "BASIC_VERIFIED",
  readinessScore: 48,
  ...SEED_METADATA,
};

export function createSeededBusinessProfile(): SeededRecord<SeedBusinessProfile> {
  return cloneSeed(SEEDED_BUSINESS_PROFILE);
}
