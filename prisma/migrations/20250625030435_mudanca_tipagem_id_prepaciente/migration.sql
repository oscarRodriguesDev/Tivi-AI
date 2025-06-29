/*
  Warnings:

  - The primary key for the `PrePaciente` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "PrePaciente" DROP CONSTRAINT "PrePaciente_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PrePaciente_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PrePaciente_id_seq";
