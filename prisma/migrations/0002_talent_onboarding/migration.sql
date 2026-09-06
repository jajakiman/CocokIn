ALTER TABLE "TalentProfile"
ADD COLUMN "portfolioUrl" TEXT,
ADD COLUMN "hasNoPortfolio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "onboardingCompletedAt" TIMESTAMP(3);

UPDATE "User" SET "email" = lower("email") WHERE "email" IS NOT NULL;
CREATE UNIQUE INDEX "User_email_lower_key" ON "User" (lower("email"));
