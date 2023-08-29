/*
  Warnings:

  - You are about to drop the column `facultyID` on the `faculties` table. All the data in the column will be lost.
  - Added the required column `facultyId` to the `faculties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faculties" DROP COLUMN "facultyID",
ADD COLUMN     "facultyId" TEXT NOT NULL;
