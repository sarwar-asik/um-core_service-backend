
import { Request, Response } from "express";
import { AcademicSemesterServices } from "./academicSemester.services";
import sendResponse from "../../../shared/sendResponse";
import { AcademicSemester } from "@prisma/client";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

const insertDB  = catchAsync(async(req:Request,res:Response)=>{
    const data = req.body
    const result = await AcademicSemesterServices.insertDB(data)
    
    sendResponse<AcademicSemester>(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Successfully created Academic Semesters",
        data:result
    })
  
})

const getAllDb = catchAsync(async(req:Request,res:Response)=>{
    const result = await AcademicSemesterServices.getAllDb()

    sendResponse<AcademicSemester[]>(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Successfully get Academic Semester Data",
        meta:result.meta,
        data:result?.data,
    })
})
export const AcademicSemesterController ={insertDB,getAllDb}