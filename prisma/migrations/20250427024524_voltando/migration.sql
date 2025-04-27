/*
  Warnings:

  - A unique constraint covering the columns `[ipNumber]` on the table `Consents_Agreements` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Consents_Agreements_ipNumber_key" ON "Consents_Agreements"("ipNumber");
