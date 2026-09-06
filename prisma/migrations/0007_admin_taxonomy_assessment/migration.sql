CREATE TYPE "AssessmentAudience" AS ENUM ('TALENT', 'BUSINESS');
CREATE TYPE "AssessmentQuestionKind" AS ENUM ('TECHNICAL', 'SOFT_SKILL', 'BUSINESS_READINESS');

ALTER TABLE "Skill"
ADD COLUMN "key" TEXT,
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "Career"
ADD COLUMN "key" TEXT,
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

CREATE UNIQUE INDEX "Skill_key_key" ON "Skill"("key");
CREATE UNIQUE INDEX "Career_key_key" ON "Career"("key");

CREATE TABLE "AssessmentQuestionRecord" (
  "id" TEXT NOT NULL,
  "audience" "AssessmentAudience" NOT NULL,
  "kind" "AssessmentQuestionKind" NOT NULL,
  "careerKey" TEXT,
  "skillKey" TEXT,
  "pillar" TEXT,
  "text" TEXT NOT NULL,
  "position" INTEGER NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AssessmentQuestionRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssessmentOptionRecord" (
  "id" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "position" INTEGER NOT NULL,
  CONSTRAINT "AssessmentOptionRecord_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AssessmentQuestionRecord_audience_careerKey_isActive_position_idx"
ON "AssessmentQuestionRecord"("audience", "careerKey", "isActive", "position");
CREATE UNIQUE INDEX "AssessmentOptionRecord_questionId_position_key"
ON "AssessmentOptionRecord"("questionId", "position");
ALTER TABLE "AssessmentOptionRecord"
ADD CONSTRAINT "AssessmentOptionRecord_questionId_fkey"
FOREIGN KEY ("questionId") REFERENCES "AssessmentQuestionRecord"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
