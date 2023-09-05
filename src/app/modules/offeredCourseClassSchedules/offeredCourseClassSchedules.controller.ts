
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { OfferedCourseClassSchedulesService } from "./offeredCourseClassSchedules.service";
import { OfferedCourseClassSchedule } from "@prisma/client";
import pick from "../../../shared/pick";
import { offeredCourseClassScheduleFilterableFields } from "./OfferedCourseClassSchedule.const";

const insertDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  // console.log(data,"oooooooo");
  const result = await OfferedCourseClassSchedulesService.insertDB(data)

  sendResponse<OfferedCourseClassSchedule>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Successfully OfferedCourseClassSchedules',
    data: result,
  });
})



// ! filter data 


const getAllDb = catchAsync(async (req: Request, res: Response) => {

//   const offeredCourseClassScheduleFilterableFields = [
//     'searchTerm',
//     'dayOfWeek',
//     'offeredCourseSectionId',
//     'semesterRegistrationId',
//     'roomId',
//     'facultyId'
// ]
  const filters = pick(req.query,offeredCourseClassScheduleFilterableFields);

  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

 
  const result = await OfferedCourseClassSchedulesService.getAllDb(filters, options);

  sendResponse<OfferedCourseClassSchedule[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully get OfferedCourseClassSchedules Data',
    meta: result.meta,
    data: result?.data,
  });
});

const getSingleDataById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await OfferedCourseClassSchedulesService.getSingleData(id);

  sendResponse<OfferedCourseClassSchedule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Successfully get ${id}`,
    data: result,
  });
});

export const OfferedCourseClassSchedulesController = {insertDB,getAllDb,getSingleDataById};
