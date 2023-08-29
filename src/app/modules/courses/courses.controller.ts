import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import {Course, CourseFaculty} from "@prisma/client";

import pick from "../../../shared/pick";
import { CoursesService } from "./courses.service";

const insertDB = catchAsync(async (req: Request, res: Response) => {
    const data = req.body;
    const result = await CoursesService.insertDB(data)
  
    sendResponse<Course>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Successfully Course',
      data: result,
    });
  });
  
const getAllDb = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query,'from getAll db controller');
    const filters = pick(req.query, [
      'searchTerm',
      "title","code","credits"
    ]);
    // CourseFilterableFields (use it in filters )
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  
    // console.log('filters:::',filters,'options::::',options);
  
    const result = await CoursesService.getAllDb(filters, options);
  
    sendResponse<Course[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Successfully get Course Data',
      meta: result.meta,
      data: result?.data,
    });
  });
  
  const getSingleDataById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
  
    const result = await CoursesService.getSingleData(id);
  
    sendResponse<Course>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Successfully get ${id}`,
      data: result,
    });
  });
  const updateIntoDb = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
  const data = req?.body;
  
    const result = await CoursesService.updateItoDb(id,data);
  
    sendResponse<Course>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Successfully updated ${id}`,
      data: result,
    });
  });

  
  const deleteFromDb = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
  
  
    const result = await CoursesService.deleteFromDb(id)
  
    sendResponse<Course>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Successfully deleted ${id}`,
      data: result,
    });
  });

  // ! faculty 

  const assignFaculties = catchAsync(async (req: Request, res: Response) => {

    const {id}= req.params
    const facultiesData = req.body.faculties
  
  
    const result = await CoursesService.assignFaculties(id,facultiesData)
  
    sendResponse<CourseFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Successfully created ${id}`,
      data: result,
    });
  });


  const removeFaculties = catchAsync(async (req: Request, res: Response) => {

    const {id}= req.params
    const facultiesData = req.body.faculties
  
  
    const result = await CoursesService.removeCourseFaculty(id,facultiesData)
  
    sendResponse<CourseFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Successfully removed ${id}`,
      data: result,
    });
  });

export const CoursesController = {insertDB,getAllDb,getSingleDataById,deleteFromDb,updateIntoDb,assignFaculties,removeFaculties};
