
import { OfferedCourseSection } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const insertDB = async (data: OfferedCourseSection): Promise<OfferedCourseSection> => {
  const isExistsOfferedCourse = await prisma.offeredCourse.findFirst({
    where:{
      id:data?.offeredCourseId
    }
  })
  if(!isExistsOfferedCourse){
    throw new ApiError(httpStatus.BAD_REQUEST,"offeredCourseId is not exist")
  }
  data.semesterRegistrationId = isExistsOfferedCourse.semesterRegistrationId
  
  const result = await prisma.offeredCourseSection.create({
    data,
  });

  return result;
};

export const OfferedCourseSectionService = {insertDB};
