import { Student, StudentEnrolledCourse } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { StudentsService } from './Students.service';

export const StudentsController = {};

const insertDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await StudentsService.insertDB(data);

  sendResponse<Student>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Successfully Student',
    data: result,
  });
});

const getAllDb = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query,'from getAll db controller');
  const filters = pick(req.query, [
    'searchTerm',
    'firstName',
    'email',
    'contactNo',
    'academicSemestarId',
  ]);
  // StudentFilterableFields (use it in filters )
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  // console.log('filters:::',filters,'options::::',options);

  const result = await StudentsService.getAllDb(filters, options);

  sendResponse<Student[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully get Student Data',
    meta: result.meta,
    data: result?.data,
  });
});

const getSingleDataById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await StudentsService.getSingleData(id);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Successfully get ${id}`,
    data: result,
  });
});
const updateIntoDb = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
const data = req?.body;

  const result = await StudentsService.updateItoDb(id,data);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Successfully updated ${id}`,
    data: result,
  });
});

const deleteFromDb = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;


  const result = await StudentsService.deleteFromDb(id)

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Successfully deleted ${id}`,
    data: result,
  });
});


const myCourses = catchAsync(async (req: Request, res: Response) => {

  const  user = (req as any).user

  const filter = pick(req?.query,['courseId','academicSemesterId'])

  const result = await StudentsService.myCourses(user?.userId,filter)

  sendResponse<StudentEnrolledCourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Successfully fetched myCoursesData`,
    data: result,
  });
});

const getMyCoursesSchedules = catchAsync(async (req: Request, res: Response) => {

  const  user = (req as any).user

  const filter = pick(req?.query,['courseId','academicSemesterId'])

  const result = await StudentsService.getMyCourseSchedules(user?.userId,filter)

  sendResponse<StudentEnrolledCourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Successfully fetched getMyCourseSchedules`,
    data: result,
  });
});


export const StudentController = { insertDB, getAllDb, getSingleDataById,updateIntoDb,deleteFromDb ,myCourses,getMyCoursesSchedules};
