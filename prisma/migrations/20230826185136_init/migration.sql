/*
  Warnings:

  - You are about to drop the column `academicFacultId` on the `academic-department` table. All the data in the column will be lost.
  - Added the required column `academicFacultyId` to the `academic-department` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "academic-department" DROP CONSTRAINT "academic-department_academicFacultId_fkey";

-- AlterTable
ALTER TABLE "academic-department" DROP COLUMN "academicFacultId",
ADD COLUMN     "academicFacultyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "academic-department" ADD CONSTRAINT "academic-department_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic-facullty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
