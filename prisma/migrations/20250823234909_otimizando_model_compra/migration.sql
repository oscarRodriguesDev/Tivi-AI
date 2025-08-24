/*
  Warnings:

  - You are about to drop the column `Status` on the `Compra` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `Compra` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentId` to the `Compra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Compra` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusCompra" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELED');

-- DropIndex
DROP INDEX "Compra_userId_key";

-- AlterTable
ALTER TABLE "Compra" DROP COLUMN "Status",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentId" TEXT NOT NULL,
ADD COLUMN     "status" "StatusCompra" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Compra_paymentId_key" ON "Compra"("paymentId");
