
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { OfferedCourseClassSchedulesService } from "./offeredCourseClassSchedules.service";
import { OfferedCourseClassSchedule } from "@prisma/client";

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
});

export const OfferedCourseClassSchedulesController = {insertDB};
