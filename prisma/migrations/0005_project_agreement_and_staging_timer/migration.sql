-- Migration 0005: ProjectAgreement & MilestoneSubmission Staging Timer
-- Sesuai penambahan fitur dual agreement signing dan staging downtime pause/resume

CREATE TABLE "ProjectAgreement" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "talentAgreedAt" TIMESTAMP(3),
  "businessAgreedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProjectAgreement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProjectAgreement_projectId_key" ON "ProjectAgreement"("projectId");

ALTER TABLE "ProjectAgreement"
ADD CONSTRAINT "ProjectAgreement_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MilestoneSubmission"
ADD COLUMN "timerPausedAt" TIMESTAMP(3),
ADD COLUMN "totalPausedMinutes" INTEGER NOT NULL DEFAULT 0;
