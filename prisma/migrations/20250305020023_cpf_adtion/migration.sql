/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `appointmentDate` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symptoms` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_psychologistId_fkey";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "appointmentDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "insurance" TEXT,
ADD COLUMN     "symptoms" TEXT NOT NULL,
ALTER COLUMN "psychologistId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_psychologistId_fkey" FOREIGN KEY ("psychologistId") REFERENCES "Psychologist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
