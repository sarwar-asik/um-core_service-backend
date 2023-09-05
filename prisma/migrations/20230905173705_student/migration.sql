/*
  Warnings:

  - You are about to drop the column `academicSemestarId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `gendar` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `studentID` on the `students` table. All the data in the column will be lost.
  - Added the required column `academicSemesterId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_academicSemestarId_fkey";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "academicSemestarId",
DROP COLUMN "gendar",
DROP COLUMN "studentID",
ADD COLUMN     "academicSemesterId" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic-semestart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
