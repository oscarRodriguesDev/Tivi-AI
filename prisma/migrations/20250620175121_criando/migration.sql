-- CreateTable
CREATE TABLE "acessos_anamnese_temp" (
    "token" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "acessado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "acessos_anamnese_temp_pkey" PRIMARY KEY ("token")
);
