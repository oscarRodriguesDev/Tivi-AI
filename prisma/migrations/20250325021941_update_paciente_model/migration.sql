/*
  Warnings:

  - Added the required column `bairro` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `complemento` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pais` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rg` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rua` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sexo` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "bairro" TEXT NOT NULL,
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "complemento" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "pais" TEXT NOT NULL,
ADD COLUMN     "rg" TEXT NOT NULL,
ADD COLUMN     "rua" TEXT NOT NULL,
ADD COLUMN     "sexo" TEXT NOT NULL;
