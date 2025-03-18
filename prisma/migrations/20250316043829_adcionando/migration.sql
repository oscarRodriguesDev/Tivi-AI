/*
  Warnings:

  - A unique constraint covering the columns `[crp]` on the table `PrePsicologo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `convenio` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fantasy_name` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `psicoloId` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crp` to the `PrePsicologo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `habilitado` to the `PrePsicologo` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `PrePsicologo` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "convenio" TEXT NOT NULL,
ADD COLUMN     "fantasy_name" TEXT NOT NULL,
ADD COLUMN     "psicoloId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PrePsicologo" ADD COLUMN     "crp" TEXT NOT NULL,
ADD COLUMN     "habilitado" BOOLEAN NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "PrePsicologo_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bandeira" TEXT,
ADD COLUMN     "celular" TEXT,
ADD COLUMN     "cep" TEXT,
ADD COLUMN     "cfp" TEXT,
ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "credit_card" TEXT,
ADD COLUMN     "creditos" TEXT,
ADD COLUMN     "crp" TEXT,
ADD COLUMN     "cvc" TEXT,
ADD COLUMN     "fantasy_name" TEXT,
ADD COLUMN     "idade" TEXT,
ADD COLUMN     "psicologoid" TEXT,
ADD COLUMN     "rg" TEXT,
ADD COLUMN     "rua" TEXT,
ADD COLUMN     "telefone" TEXT,
ADD COLUMN     "uf" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PrePsicologo_crp_key" ON "PrePsicologo"("crp");
