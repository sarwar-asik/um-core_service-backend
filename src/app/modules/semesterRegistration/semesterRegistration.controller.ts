
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { SemesterRegistrationService } from "./semesterRegistration.service";
import { SemesterRegistration } from "@prisma/client";
import { semesterRegistrationFilterableFields } from "./semesterRegistration.constant";
import pick from "../../../shared/pick";

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



const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, semesterRegistrationFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await SemesterRegistrationService.getAllFromDB(filters, options);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistrations fetched successfully',
      meta: result.meta,
      data: result.data
  });
})

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SemesterRegistrationService.getByIdFromDB(id);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration fetched successfully',
      data: result
  });
})
const updateOneToDB = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;
  const updateData= req?.body
  const result = await SemesterRegistrationService.updateOneToDB(id,updateData)
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration updated successfully',
      data: result
  });
})

export const SemesterRegistrationController = {insertDB,getAllFromDB,getByIdFromDB,updateOneToDB};
