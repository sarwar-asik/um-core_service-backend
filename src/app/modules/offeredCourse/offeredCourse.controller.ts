
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { OfferedCourseService } from "./offeredCourse.service";
import { OfferedCourse } from "@prisma/client";

const insertDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await OfferedCourseService.insertDB(data)

  sendResponse<OfferedCourse[]>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Successfully created OfferedCourse',
    data: result,
  });
});

export const OfferedCourseController = {insertDB};
