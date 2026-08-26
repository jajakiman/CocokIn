import { PublicPassportCard } from "@/src/components/talent/public-passport-card";
import {
  createSeededTalentPassport,
  SEEDED_TALENT_PROFILE,
} from "@/src/fixtures/seeded-demo";

export default async function PublicPassportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  // Gunakan central deterministic seeded passport
  const seededPassport = createSeededTalentPassport();

  return (
    <div className="public-passport-page">
      <PublicPassportCard
        talentName={SEEDED_TALENT_PROFILE.name}
        university={SEEDED_TALENT_PROFILE.university}
        major={SEEDED_TALENT_PROFILE.major}
        passport={seededPassport}
      />
    </div>
  );
}
