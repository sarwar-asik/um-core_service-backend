
import {  Prisma,OfferedCourse } from '@prisma/client';

const insertDB = async (data: OfferedCourse): Promise<OfferedCourse> => {
  const result = await prisma.offeredCourse.create({
    data,
  });

  return result;
};

export const OfferedCourseService = {insertDB};
