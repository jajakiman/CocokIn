CREATE TYPE "MessageReportStatus" AS ENUM ('PENDING', 'DISMISSED', 'ACTIONED');
CREATE TYPE "SolutionCategory" AS ENUM ('WEBSITE_BRANDING', 'CATALOG_COMMERCE', 'OPERATIONS_POS', 'DIGITAL_MARKETING', 'DATA_ANALYTICS', 'OTHER');

ALTER TABLE "Project"
ADD COLUMN "solutionCategory" "SolutionCategory" NOT NULL DEFAULT 'OTHER';

UPDATE "Project"
SET "solutionCategory" = CASE
  WHEN lower("title" || ' ' || "scope") ~ '(pos|kasir|inventori|stok|operasional)' THEN 'OPERATIONS_POS'::"SolutionCategory"
  WHEN lower("title" || ' ' || "scope") ~ '(dashboard|analitik|analytics|laporan data)' THEN 'DATA_ANALYTICS'::"SolutionCategory"
  WHEN lower("title" || ' ' || "scope") ~ '(seo|iklan|kampanye|marketing|media sosial|instagram)' THEN 'DIGITAL_MARKETING'::"SolutionCategory"
  WHEN lower("title" || ' ' || "scope") ~ '(katalog|e-commerce|order|checkout|keranjang|toko online)' THEN 'CATALOG_COMMERCE'::"SolutionCategory"
  WHEN lower("title" || ' ' || "scope") ~ '(website|landing|company profile|branding|merek)' THEN 'WEBSITE_BRANDING'::"SolutionCategory"
  ELSE 'OTHER'::"SolutionCategory"
END;

ALTER TABLE "MessageReport"
ADD COLUMN "status" "MessageReportStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "resolutionNotes" TEXT,
ADD COLUMN "resolvedAt" TIMESTAMP(3),
ADD COLUMN "resolvedById" TEXT,
ADD COLUMN "messageContent" TEXT NOT NULL DEFAULT '[Pesan tidak tersedia]',
ADD COLUMN "messageSenderId" TEXT NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN "messageCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "reporterName" TEXT NOT NULL DEFAULT 'Pengguna';

UPDATE "MessageReport" AS report
SET
  "messageContent" = COALESCE(message."content", '[Lampiran tanpa teks]'),
  "messageSenderId" = message."senderId",
  "messageCreatedAt" = message."createdAt"
FROM "ChatMessage" AS message
WHERE message."id" = report."messageId";

UPDATE "MessageReport" AS report
SET "reporterName" = COALESCE(app_user."name", app_user."email", 'Pengguna')
FROM "User" AS app_user
WHERE app_user."id" = report."reporterId";

ALTER TABLE "MessageReport" DROP CONSTRAINT IF EXISTS "MessageReport_reporterId_fkey";
ALTER TABLE "MessageReport" ALTER COLUMN "reporterId" DROP NOT NULL;
ALTER TABLE "MessageReport"
ADD CONSTRAINT "MessageReport_reporterId_fkey"
FOREIGN KEY ("reporterId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MessageReport"
ADD CONSTRAINT "MessageReport_resolvedById_fkey"
FOREIGN KEY ("resolvedById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "MessageReport_status_createdAt_idx"
ON "MessageReport"("status", "createdAt");
