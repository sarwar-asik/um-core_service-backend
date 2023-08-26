import { Student } from '@prisma/client';
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
export const StudentController = { insertDB, getAllDb, getSingleDataById };
