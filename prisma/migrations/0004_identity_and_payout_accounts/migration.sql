ALTER TABLE "User"
ADD COLUMN "isSuspended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "suspendedAt" TIMESTAMP(3),
ADD COLUMN "suspensionReason" TEXT,
ADD COLUMN "isSynthetic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "isDemoAccount" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "TalentPayoutAccount" (
  "id" TEXT NOT NULL,
  "talentProfileId" TEXT NOT NULL,
  "bankName" TEXT NOT NULL,
  "accountNumber" TEXT NOT NULL,
  "accountHolder" TEXT NOT NULL,
  "verifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TalentPayoutAccount_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TalentPayoutAccount_talentProfileId_key"
ON "TalentPayoutAccount"("talentProfileId");

ALTER TABLE "TalentPayoutAccount"
ADD CONSTRAINT "TalentPayoutAccount_talentProfileId_fkey"
FOREIGN KEY ("talentProfileId") REFERENCES "TalentProfile"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PayoutInstruction"
ADD COLUMN "recipientBank" TEXT NOT NULL DEFAULT 'UNSET',
ADD COLUMN "recipientAccount" TEXT NOT NULL DEFAULT 'UNSET',
ADD COLUMN "recipientName" TEXT NOT NULL DEFAULT 'UNSET';

ALTER TABLE "PayoutInstruction"
ALTER COLUMN "recipientBank" DROP DEFAULT,
ALTER COLUMN "recipientAccount" DROP DEFAULT,
ALTER COLUMN "recipientName" DROP DEFAULT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "PayoutInstruction"
    GROUP BY "milestoneId"
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate payout instructions exist for one or more milestones';
  END IF;
END $$;

CREATE UNIQUE INDEX "PayoutInstruction_milestoneId_key" ON "PayoutInstruction"("milestoneId");
