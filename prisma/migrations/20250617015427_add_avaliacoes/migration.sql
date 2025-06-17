-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" TEXT NOT NULL,
    "audio" INTEGER NOT NULL,
    "video" INTEGER NOT NULL,
    "experienciaGeral" INTEGER NOT NULL,
    "avaliacaoProfissional" INTEGER NOT NULL,
    "comentario" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "psicologoId" TEXT NOT NULL,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_psicologoId_fkey" FOREIGN KEY ("psicologoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
