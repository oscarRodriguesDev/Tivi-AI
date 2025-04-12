/*
  Warnings:

  - You are about to drop the column `duração` on the `Consulta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Consulta" DROP COLUMN "duração",
ADD COLUMN     "duracao" TEXT;
