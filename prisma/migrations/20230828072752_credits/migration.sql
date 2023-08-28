/*
  Warnings:

  - You are about to drop the column `crefits` on the `courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "crefits",
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0;
