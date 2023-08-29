/*
  Warnings:

  - You are about to drop the column `gendar` on the `faculties` table. All the data in the column will be lost.
  - Added the required column `gender` to the `faculties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faculties" DROP COLUMN "gendar",
ADD COLUMN     "gender" TEXT NOT NULL;
