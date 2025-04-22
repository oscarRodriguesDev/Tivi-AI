-- CreateTable
CREATE TABLE "Consents_Agreements" (
    "ipNumber" TEXT NOT NULL,
    "data_consent" TEXT NOT NULL,
    "hora_consent" TEXT NOT NULL,
    "nome_consent" TEXT NOT NULL,
    "cpf_consent" TEXT NOT NULL,

    CONSTRAINT "Consents_Agreements_pkey" PRIMARY KEY ("ipNumber")
);

-- CreateTable
CREATE TABLE "cookies_consent" (
    "ipNumber" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "Hora" TEXT NOT NULL,
    "permissão" BOOLEAN NOT NULL,

    CONSTRAINT "cookies_consent_pkey" PRIMARY KEY ("ipNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "Consents_Agreements_cpf_consent_key" ON "Consents_Agreements"("cpf_consent");
