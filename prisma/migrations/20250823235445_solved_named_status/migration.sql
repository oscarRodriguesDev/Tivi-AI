/*
  Warnings:

  - You are about to drop the column `status` on the `Compra` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Compra" DROP COLUMN "status",
ADD COLUMN     "Status" "StatusCompra" NOT NULL DEFAULT 'PENDING';
