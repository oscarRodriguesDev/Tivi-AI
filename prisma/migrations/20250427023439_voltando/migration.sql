/*
  Warnings:

  - A unique constraint covering the columns `[ipNumber]` on the table `cookies_consent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cookies_consent_ipNumber_key" ON "cookies_consent"("ipNumber");
