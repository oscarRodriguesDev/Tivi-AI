/*
  Warnings:

  - The required column `id` was added to the `Consents_Agreements` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `cookies_consent` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Consents_Agreements" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Consents_Agreements_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "cookies_consent" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "cookies_consent_pkey" PRIMARY KEY ("id");
