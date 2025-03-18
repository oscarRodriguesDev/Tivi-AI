/*
  Warnings:

  - You are about to drop the column `cfp` on the `PrePsicologo` table. All the data in the column will be lost.
  - You are about to drop the column `cfp` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PrePsicologo_cfp_key";

-- AlterTable
ALTER TABLE "PrePsicologo" DROP COLUMN "cfp";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cfp";
