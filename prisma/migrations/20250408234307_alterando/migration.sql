/*
  Warnings:

  - You are about to drop the column `lastName` on the `Paciente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "lastName";

-- AlterTable
ALTER TABLE "PrePsicologo" ADD COLUMN     "lastname" TEXT;
