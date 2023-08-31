import { OfferedCourseClassSchedulesUtils } from './offeredCourseClassSchedules.utils';
import { OfferedCourseClassSchedule} from '@prisma/client';

import prisma from '../../../shared/prisma';


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



export const OfferedCourseClassSchedulesService = { insertDB};
