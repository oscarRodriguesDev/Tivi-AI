/*
  Warnings:

  - The primary key for the `Consents_Agreements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cookies_consent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[ipNumber]` on the table `Consents_Agreements` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ipNumber]` on the table `cookies_consent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Consents_Agreements" DROP CONSTRAINT "Consents_Agreements_pkey";

-- AlterTable
ALTER TABLE "cookies_consent" DROP CONSTRAINT "cookies_consent_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "Consents_Agreements_ipNumber_key" ON "Consents_Agreements"("ipNumber");

-- CreateIndex
CREATE UNIQUE INDEX "cookies_consent_ipNumber_key" ON "cookies_consent"("ipNumber");
