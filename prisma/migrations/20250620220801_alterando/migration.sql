/*
  Warnings:

  - You are about to drop the `acessos_anamnese_temp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "acessos_anamnese_temp";

-- CreateTable
CREATE TABLE "AcessoAnamneseTemp" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ip" TEXT,
    "acessado_em" TIMESTAMP(3),
    "pacienteId" TEXT NOT NULL,
    "psicologoId" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AcessoAnamneseTemp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcessoAnamneseTemp_token_key" ON "AcessoAnamneseTemp"("token");
