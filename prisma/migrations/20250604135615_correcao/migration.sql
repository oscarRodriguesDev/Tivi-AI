/*
  Warnings:

  - You are about to drop the column `psicoloId` on the `Paciente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "psicoloId",
ADD COLUMN     "psicologoId" TEXT;
