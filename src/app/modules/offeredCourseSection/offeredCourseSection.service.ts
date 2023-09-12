import { OfferedCourseSection } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../courses/utils';
import { OfferedCourseClassSchedulesUtils } from '../offeredCourseClassSchedules/offeredCourseClassSchedules.utils';

const insertDB = async (
  payload: OfferedCourseSection | any
): Promise<OfferedCourseSection> => {
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
  data.semesterRegistrationId = isExistsOfferedCourse.semesterRegistrationId;

  await asyncForEach(classSchedules, async (schedule: any) => {
    await OfferedCourseClassSchedulesUtils.checkRoomAvailable(schedule);
    await OfferedCourseClassSchedulesUtils.checkFacultyAvailable(schedule);
  });

  const createSection = await prisma.$transaction(async transactionClient => {
    const createOfferedCourseSection =
      await transactionClient.offeredCourseSection.create({
        data,
      });
    const scheduleData = classSchedules.map((schedule:any) => ({
      startTime: schedule?.startTime,
      endTime: schedule?.endTime,
      dayOfWeek: schedule?.dayOfWeek,
      roomId: schedule?.roomId,
      facultyId: schedule?.facultyId,
      offeredCourseSectionId: createOfferedCourseSection?.id,
      semesterRegistrationId: isExistsOfferedCourse?.semesterRegistrationId,
    }));

    // console.log(scheduleData,"scheduleData");

    const createSchedules = await transactionClient.offeredCourseClassSchedule.createMany({
      data:scheduleData
    })
    console.log(createSchedules,"createSchedules");

    return createSchedules
  });

  return createSection
  // return result;
};

const getAllDb = async () => {
  const data = await prisma.offeredCourseSection.findMany({});
  return data;
};

export const OfferedCourseSectionService = { insertDB, getAllDb };
