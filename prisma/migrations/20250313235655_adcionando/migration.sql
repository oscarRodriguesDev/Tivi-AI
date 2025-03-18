-- CreateTable
CREATE TABLE "PrePsicologo" (
    "cpf" TEXT NOT NULL,
    "cfp" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "data_nasc" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "telefone" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PrePsicologo_cpf_key" ON "PrePsicologo"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "PrePsicologo_cfp_key" ON "PrePsicologo"("cfp");

-- CreateIndex
CREATE UNIQUE INDEX "PrePsicologo_email_key" ON "PrePsicologo"("email");
