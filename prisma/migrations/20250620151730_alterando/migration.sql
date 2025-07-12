/*
  Warnings:

  - The `result_amnp` column on the `Paciente` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "result_amnp",
ADD COLUMN     "result_amnp" TEXT[];
