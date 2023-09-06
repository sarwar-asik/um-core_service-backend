
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { OfferedCourseSection } from "@prisma/client";
import { OfferedCourseSectionService } from "./offeredCourseSection.service";

const insertDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await OfferedCourseSectionService.insertDB(data)

  sendResponse<OfferedCourseSection>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Successfully OfferedCourseSection',
    data: result,
  });
});

const getAllDB = catchAsync(async (req: Request, res: Response) => {
 
  const result = await OfferedCourseSectionService.getAllDb()

  sendResponse<OfferedCourseSection[]>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Successfully fetched OfferedCourseSection',
    data: result,
  });
});

export const OfferedCourseSectionController = {insertDB,getAllDB};
