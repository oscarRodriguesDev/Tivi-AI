/*
  Warnings:

  - You are about to drop the column `descritpion` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "descritpion",
ADD COLUMN     "description" TEXT;
