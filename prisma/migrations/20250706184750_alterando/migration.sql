/*
  Warnings:

  - Added the required column `psicologoId` to the `base_cientific` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "base_cientific" ADD COLUMN     "psicologoId" TEXT NOT NULL;
