-- CreateTable
CREATE TABLE "base_cientific" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "url_capa" TEXT,
    "resumo" TEXT NOT NULL,

    CONSTRAINT "base_cientific_pkey" PRIMARY KEY ("id")
);
