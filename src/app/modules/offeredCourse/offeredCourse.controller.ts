
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { OfferedCourseService } from "./offeredCourse.service";
import { OfferedCourse } from "@prisma/client";
import pick from "../../../shared/pick";

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


const getAllDb = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query,'from getAll db controller');
  const filters = pick(req.query, [
    'searchTerm',
    'courseId','academicDepartmentId','semesterRegistrationId'
  ]);
  // CourseFilterableFields (use it in filters )
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  // console.log('filters:::',filters,'options::::',options);

  const result = await OfferedCourseService.getAllDb(filters, options);

  sendResponse<OfferedCourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully get OfferedCourse Data',
    meta: result.meta,
    data: result?.data,
  });
});

const getSingleDataById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await OfferedCourseService.getSingleData(id);

  sendResponse<OfferedCourse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Successfully get ${id}`,
    data: result,
  });
});

export const OfferedCourseController = {insertDB,getAllDb,getSingleDataById};
