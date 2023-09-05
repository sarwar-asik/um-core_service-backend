/*
  Warnings:

  - The primary key for the `CourseToPrerequisite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseID` on the `CourseToPrerequisite` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `CourseToPrerequisite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CourseToPrerequisite" DROP CONSTRAINT "CourseToPrerequisite_courseID_fkey";

-- AlterTable
ALTER TABLE "CourseToPrerequisite" DROP CONSTRAINT "CourseToPrerequisite_pkey",
DROP COLUMN "courseID",
ADD COLUMN     "courseId" TEXT NOT NULL,
ADD CONSTRAINT "CourseToPrerequisite_pkey" PRIMARY KEY ("courseId", "prerequisiteId");

-- AddForeignKey
ALTER TABLE "CourseToPrerequisite" ADD CONSTRAINT "CourseToPrerequisite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
