import { OfferedCourse } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../courses/utils';
import { ICreateOfferedCourse } from './offered.interface';

const insertDB = async (
  data: ICreateOfferedCourse
): Promise<OfferedCourse[]> => {
  const { courseIds, academicDepartmentId, semesterRegistrationId } = data;

  const result: OfferedCourse[] = [];

  await asyncForEach(courseIds, async (courseId: string) => {
    const alreadyExist = await prisma.offeredCourse.findFirst({
      where: {
        courseId,
        academicDepartmentId,
        semesterRegistrationId,
      },
    });

    if (!alreadyExist) {
      const insertOfferedCourse = await prisma.offeredCourse.create({
        data: {
          academicDepartmentId,
          semesterRegistrationId,
          courseId,
        },
        include: {
          course: true,
          academicDepartment: true,
          semesterRegistration: true,
        },
      });
      result.push(insertOfferedCourse);
    }
  });

  return result;
};

export const OfferedCourseService = { insertDB };
