-- CreateTable
CREATE TABLE "Historico" (
    "id" TEXT NOT NULL,
    "psicologoId" TEXT NOT NULL,
    "userName" TEXT,
    "descricao" TEXT,
    "tipo" TEXT DEFAULT 'geral',
    "timestamp" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Historico_pkey" PRIMARY KEY ("id")
);
