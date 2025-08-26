/*
  Warnings:

  - Added the required column `qtdCreditos` to the `Compra` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "qtdCreditos" TEXT NOT NULL;
