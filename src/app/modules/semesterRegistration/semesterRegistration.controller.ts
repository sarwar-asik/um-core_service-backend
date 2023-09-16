import { SemesterRegistration } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { semesterRegistrationFilterableFields } from './semesterRegistration.constant';
import { SemesterRegistrationService } from './semesterRegistration.service';

const insertDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await SemesterRegistrationService.insertDB(data);

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
  const result = await SemesterRegistrationService.getAllFromDB(
    filters,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SemesterRegistrations fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SemesterRegistrationService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SemesterRegistration fetched successfully',
    data: result,
  });
});
const updateOneToDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req?.body;
  const result = await SemesterRegistrationService.updateOneToDB(
    id,
    updateData
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SemesterRegistration updated successfully',
    data: result,
  });
});

const startRegistration = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  // console.log(user, 'uuuuuuuuuuu');
  // console.log(req.headers.authorization,"aaaaaaaaa");

  const result = await SemesterRegistrationService.startMyRegistration(
    user?.userId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration  successfully',
    data: result,
  });
});

const enrollToCourse = catchAsync(async (req: Request, res: Response) => {
const user = (req as any ).user
// console.log(user);

const result = await SemesterRegistrationService.enrollIntoCourse(user?.userId,req.body)

sendResponse(res, {
  statusCode: httpStatus.OK,
  success: true,
  message: 'enrollment successfully',
  data: result,
});

})



const withdrawFromCourse = catchAsync(async (req: Request, res: Response) => {
const user = (req as any ).user
// console.log(user);

const result = await SemesterRegistrationService.withdrawFromCourse(user?.userId,req.body)

sendResponse(res, {
  statusCode: httpStatus.OK,
  success: true,
  message: 'withdraw from course successfully',
  data: result,
});

})

const confirmMyRegistration= catchAsync(async (req: Request, res: Response) => {
const user = (req as any ).user
// console.log(user);

const result = await SemesterRegistrationService.confirmMyRegistration(user?.userId)

sendResponse(res, {
  statusCode: httpStatus.OK,
  success: true,
  message: 'confirmed registration successfully',
  data: result,
});

})

const getMyRegistration= catchAsync(async (req: Request, res: Response) => {
const user = (req as any ).user
// console.log(user);

const result = await SemesterRegistrationService.getMyRegistration(user?.userId)

sendResponse(res, {
  statusCode: httpStatus.OK,
  success: true,
  message: 'get my registration successfully',
  data: result,
});

})


const startNewRegistration= catchAsync(async (req: Request, res: Response) => {

const {id} = req.params
// console.log(user);

const result = await SemesterRegistrationService.startNewSemester(id)

sendResponse(res, {
  statusCode: httpStatus.OK,
  success: true,
  message: 'start New semester registration successfully',
  data: result,
});

})

const getMySemesterRegistrationCourses= catchAsync(async (req: Request, res: Response) => {
  const user = (req as any ).user
  // console.log(user);
  
  const result = await SemesterRegistrationService.getMySemesterRegistrationCourses(user?.userId)
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get my registration courses successfully',
    data: result,
  });
  
  })
  

export const SemesterRegistrationController = {
  insertDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneToDB,
  startRegistration,
  enrollToCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewRegistration,
  getMySemesterRegistrationCourses
};
