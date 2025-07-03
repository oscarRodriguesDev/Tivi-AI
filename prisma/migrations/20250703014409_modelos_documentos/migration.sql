-- CreateTable
CREATE TABLE "model_doc" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "psicologoId" TEXT NOT NULL,

    CONSTRAINT "model_doc_pkey" PRIMARY KEY ("id")
);
