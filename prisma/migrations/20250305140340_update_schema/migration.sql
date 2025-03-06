/*
  Warnings:

  - Added the required column `licenseNumber` to the `Psychologist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Psychologist" ADD COLUMN     "licenseNumber" TEXT NOT NULL;
