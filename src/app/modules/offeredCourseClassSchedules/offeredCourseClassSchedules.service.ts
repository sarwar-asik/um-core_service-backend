import { OfferedCourseClassSchedulesUtils } from './offeredCourseClassSchedules.utils';
import { OfferedCourseClassSchedule, Prisma} from '@prisma/client';

import prisma from '../../../shared/prisma';
import { IOfferedCourseClassScheduleFilterRequest } from './OfferedCourseClassSchedule.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { OfferedCourseClassScheduleSearchableFields, offeredCourseClassScheduleRelationalFields, offeredCourseClassScheduleRelationalFieldsMapper } from './OfferedCourseClassSchedule.const';


const insertDB = async (
  data: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {


  await OfferedCourseClassSchedulesUtils.checkRoomAvailable(data)
  await OfferedCourseClassSchedulesUtils.checkFacultyAvailable(data)


// const alreadyBookedRoomOnDay = await prisma.offeredCourseClassSchedule.findMany({
//   where:{
//     dayOfWeek:data?.dayOfWeek,
//     room:{
//       id:data?.roomId
//     }
//   }
// })

// console.log(alreadyBookedRoomOnDay,'aaaaaaaaaa');

// const existingSlots = alreadyBookedRoomOnDay.map((schedules)=>({
//   startTime:schedules.startTime,
//   endTime:schedules.endTime,
//   dayOfWeek:schedules.dayOfWeek

// }))

// console.log(existingSlots,"exiiiiiiiii");
// const newSlot ={
//   startTime :data?.startTime,
//   endTime:data?.endTime,
//   dayOfWeek:data?.dayOfWeek

// }
// console.log(newSlot,"newwwwwwwwwwww");



// // for ( const  slot of existingSlots){
// //   const existingStartTime = new Date(`1970-01-01T${slot.startTime}:00`)
// //   const existingEndTime = new Date(`1970-01-01T${slot.endTime}:00`)
// //   const newStartTime = new Date(`1970-01-01T${newSlot.startTime}:00`)
// //   const newEndTime = new Date(`1970-01-01T${newSlot.endTime}:00`)

// //   if(newStartTime  <= existingStartTime && newEndTime >= existingEndTime){
// //     throw new ApiError(httpStatus.CONFLICT,"The Room already booked  ")
// //     // console.log('the room booked');
// //   }


// // }

// if(hasTimeConflict(existingSlots,newSlot)){
//   throw new ApiError(httpStatus.CONFLICT,"The Room already booked  ")
// }

  const result = await prisma.offeredCourseClassSchedule.create({
    data,
    include:{
      faculty:true,
      offeredCourseSection:true,
      room:true,
      semesterRegistration:true,
      
    }
  });

  return result;
};

// !filter data 

// type IOfferedCourseClassScheduleFilterRequest = {
//   searchTerm?: string;
// };

const getAllDb = async (
  filters: IOfferedCourseClassScheduleFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseClassSchedule[]>> => {
  // !for pagination
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  //   console.log('page',page,'limit',limit,'skip',skip)
  //   ! for filters

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: OfferedCourseClassScheduleSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // if (Object.keys(filtersData).length > 0) {
  //   andConditions.push({
  //     AND: Object.keys(filtersData).map(key => ({
  //       [key]: {
  //         equals: (filtersData as any)[key],
  //       },
  //     })),
  //   });
  // }

  
  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
        AND: Object.keys(filtersData).map((key) => {
            if (offeredCourseClassScheduleRelationalFields.includes(key)) {
                return {
                    [offeredCourseClassScheduleRelationalFieldsMapper[key]]: {
                        id: (filtersData as any)[key]
                    }
                };
            } else {
                return {
                    [key]: {
                        equals: (filtersData as any)[key]
                    }
                };
            }
        })
    });
}


  // for andCondition for where

  const whereCondition: Prisma.OfferedCourseClassScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offeredCourseClassSchedule.findMany({
    where: whereCondition,
    skip,
    take: limit,

    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
          include:{
            faculty:true,
            offeredCourseSection:true,
            room:true,
            semesterRegistration:true,
            
          }
  });
  const total = await prisma.academicSemester.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// !get single data

const getSingleData = async (id: string): Promise<OfferedCourseClassSchedule | null> => {
  const result = await prisma.offeredCourseClassSchedule.findUnique({
    where: {
      id,
    },
  });

  return result;
};

export const OfferedCourseClassSchedulesService = { insertDB,getAllDb,getSingleData};
