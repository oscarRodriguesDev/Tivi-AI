/*
  Warnings:

  - A unique constraint covering the columns `[cfp]` on the table `PrePsicologo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cfp` to the `PrePsicologo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrePsicologo" ADD COLUMN     "cfp" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cfp" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PrePsicologo_cfp_key" ON "PrePsicologo"("cfp");
