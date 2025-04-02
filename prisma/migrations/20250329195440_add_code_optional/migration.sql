/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Consulta` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Consulta" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Consulta_code_key" ON "Consulta"("code");
