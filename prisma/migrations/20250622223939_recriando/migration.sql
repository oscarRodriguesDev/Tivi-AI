-- DropForeignKey
ALTER TABLE "AcessoAnamneseTemp" DROP CONSTRAINT "AcessoAnamneseTemp_psicologoId_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_psicologoId_fkey";

-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_psicologoId_fkey";

-- DropForeignKey
ALTER TABLE "Paciente" DROP CONSTRAINT "Paciente_psicologoId_fkey";
