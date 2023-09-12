import { OfferedCourseSection } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../courses/utils';
import { OfferedCourseClassSchedulesUtils } from '../offeredCourseClassSchedules/offeredCourseClassSchedules.utils';
import { IClassSchedule, IOfferedCourseSectionCreate } from './offeredCourseSection.interface';

const insertDB = async (
  payload: IOfferedCourseSectionCreate
): Promise<OfferedCourseSection | null > => {
  const { classSchedules, ...data } = payload;

  // console.log(data,"data",classSchedules);

  const isExistsOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: data?.offeredCourseId,
    },
  });
  if (!isExistsOfferedCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'offeredCourseId is not exist');
  }

  // data.semesterRegistrationId = isExistsOfferedCourse.semesterRegistrationId;


  // check exist //

  const offerCourseExist = await prisma.offeredCourseSection.findFirst({
    where: {
      offeredCourse: {
        id: data?.offeredCourseId,
      },
      title: data?.title,
    },
  });

  if (offerCourseExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'offeredCourseSection already exits '
    );
  }


  await asyncForEach(classSchedules, async (schedule: any) => {
    await OfferedCourseClassSchedulesUtils.checkRoomAvailable(schedule);
    await OfferedCourseClassSchedulesUtils.checkFacultyAvailable(schedule);
  });

  const createSection = await prisma.$transaction(async transactionClient => {
    const createOfferedCourseSection =
      await transactionClient.offeredCourseSection.create({
        data:{
          title:data?.title,
          maxCapacity:data?.maxCapacity,
          offeredCourseId:data?.offeredCourseId,
          semesterRegistrationId:isExistsOfferedCourse?.semesterRegistrationId
        }
      });
    const scheduleData = classSchedules.map((schedule: IClassSchedule) => ({
      startTime: schedule?.startTime,
      endTime: schedule?.endTime,
      dayOfWeek: schedule?.dayOfWeek,
      roomId: schedule?.roomId,
      facultyId: schedule?.facultyId,
      offeredCourseSectionId: createOfferedCourseSection?.id,
      semesterRegistrationId: isExistsOfferedCourse?.semesterRegistrationId,
    }));

    // console.log(scheduleData,"scheduleData");

    // const createSchedules =
      await transactionClient.offeredCourseClassSchedule.createMany({
        data: scheduleData,
      });
    // console.log(createSchedules, 'createSchedules');

    return createOfferedCourseSection
  });

  const  result = await prisma.offeredCourseSection.findFirst({
    where:{
      id:createSection?.id
    },
    include:{
      offeredCourse:{
        include:{
          course:true
        }
      },
      offeredCourseClassSchedule:{
        include:{
          room:{
            include:{
              building:true
            }
          },
          faculty:true
        }
      }
      
    }
  })

  return result;
};

const getAllDb = async () => {
  const data = await prisma.offeredCourseSection.findMany({});
  return data;
};

export const OfferedCourseSectionService = { insertDB, getAllDb };
