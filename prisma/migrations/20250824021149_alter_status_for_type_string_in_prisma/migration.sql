/*
  Warnings:

  - Changed the type of `Status` on the `Compra` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Compra" DROP COLUMN "Status",
ADD COLUMN     "Status" TEXT NOT NULL;

-- DropEnum
DROP TYPE "StatusCompra";
