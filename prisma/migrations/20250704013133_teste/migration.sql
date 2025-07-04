/*
  Warnings:

  - You are about to drop the column `url` on the `model_doc` table. All the data in the column will be lost.
  - Added the required column `prompt` to the `model_doc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "model_doc" DROP COLUMN "url",
ADD COLUMN     "prompt" TEXT NOT NULL;
