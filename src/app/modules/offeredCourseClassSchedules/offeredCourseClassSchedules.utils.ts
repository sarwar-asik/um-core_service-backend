import { OfferedCourseClassSchedule } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { hasTimeConflict } from "../courses/utils";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";


const checkRoomAvailable = async (data: OfferedCourseClassSchedule) => {
    const alreadyBookedRoomOnDay = await prisma.offeredCourseClassSchedule.findMany({
        where: {
            dayOfWeek: data.dayOfWeek,
            room: {
                id: data.roomId
            }
        }
    })

    const existingSlots = alreadyBookedRoomOnDay.map((schedule) => ({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek
    }))


    const newSlot = {
        startTime: data.startTime,
        endTime: data.endTime,
        dayOfWeek: data.dayOfWeek
    }

    if (hasTimeConflict(existingSlots, newSlot)) {
        throw new ApiError(httpStatus.CONFLICT, "Room is already booked!")
    }
}


const checkFacultyAvailable = async(data:OfferedCourseClassSchedule)=>{
    const alreadyFacultyAssigned = await  prisma.offeredCourseClassSchedule.findMany({
      where:{
        dayOfWeek:data?.dayOfWeek,
        room:{
          id:data?.roomId
        }
      }
    })

    const existingSlots = alreadyFacultyAssigned.map((schedule) => ({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek
    }))


    const newSlot = {
        startTime: data.startTime,
        endTime: data.endTime,
        dayOfWeek: data.dayOfWeek
    }

    if (hasTimeConflict(existingSlots, newSlot)) {
        throw new ApiError(httpStatus.CONFLICT, "Faculty is already booked!")
    }
    // console.log(alreadyFacultyAssigned);
    // return alreadyFacultyAssigned
  }
  
  
  
  export const OfferedCourseClassSchedulesUtils = {checkRoomAvailable, checkFacultyAvailable};