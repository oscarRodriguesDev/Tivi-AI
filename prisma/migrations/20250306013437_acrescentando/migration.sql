/*
  Warnings:

  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Psychologist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_psychologistId_fkey";

-- DropForeignKey
ALTER TABLE "Psychologist" DROP CONSTRAINT "Psychologist_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "registro" TEXT;

-- DropTable
DROP TABLE "Patient";

-- DropTable
DROP TABLE "Psychologist";
