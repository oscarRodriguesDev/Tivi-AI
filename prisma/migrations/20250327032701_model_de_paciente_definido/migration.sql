-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "fantasy_name" TEXT NOT NULL,
    "psicologoId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "hora" TEXT NOT NULL,
    "tipo_consulta" TEXT NOT NULL,
    "observacao" TEXT NOT NULL,
    "recorrencia" TEXT NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);
