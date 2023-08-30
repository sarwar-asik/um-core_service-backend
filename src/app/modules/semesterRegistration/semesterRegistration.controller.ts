
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { SemesterRegistrationService } from "./semesterRegistration.service";
import { SemesterRegistration } from "@prisma/client";

const insertDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await SemesterRegistrationService.insertDB(data)

  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Successfully SemesterRegistration',
    data: result,
  });
});

export const SemesterRegistrationController = {insertDB};
