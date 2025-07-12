-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_psicologoId_fkey" FOREIGN KEY ("psicologoId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_psicologoId_fkey" FOREIGN KEY ("psicologoId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_psicologoId_fkey" FOREIGN KEY ("psicologoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcessoAnamneseTemp" ADD CONSTRAINT "AcessoAnamneseTemp_psicologoId_fkey" FOREIGN KEY ("psicologoId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
