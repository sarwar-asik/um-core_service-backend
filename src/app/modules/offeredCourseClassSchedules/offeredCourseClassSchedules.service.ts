import { OfferedCourseClassSchedule} from '@prisma/client';

import prisma from '../../../shared/prisma';

const insertDB = async (
  data: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
  const result = await prisma.offeredCourseClassSchedule.create({
    data,
  });

  return result;
};

export const OfferedCourseClassSchedulesService = { insertDB };
