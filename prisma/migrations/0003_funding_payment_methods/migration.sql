CREATE TYPE "FundingPaymentMethod" AS ENUM ('BANK_TRANSFER', 'QRIS');

ALTER TABLE "FundingReceipt"
ADD COLUMN "paymentMethod" "FundingPaymentMethod" NOT NULL DEFAULT 'BANK_TRANSFER',
ADD COLUMN "destinationBank" TEXT,
ADD COLUMN "destinationAccount" TEXT,
ADD COLUMN "destinationAccountHolder" TEXT,
ADD COLUMN "senderBank" TEXT,
ADD COLUMN "senderAccount" TEXT,
ADD COLUMN "senderName" TEXT,
ADD COLUMN "paymentReference" TEXT;

UPDATE "FundingReceipt"
SET
  "destinationBank" = 'BCA',
  "destinationAccount" = '88012' || LPAD(RIGHT(REGEXP_REPLACE("projectId", '[^0-9]', '', 'g'), 8), 8, '12345678'),
  "destinationAccountHolder" = 'PT COCOKIN TEKNOLOGI INDONESIA'
WHERE "paymentMethod" = 'BANK_TRANSFER';
