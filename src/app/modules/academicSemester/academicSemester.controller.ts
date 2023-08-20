
import { Request, Response } from "express";
import { AcademicSemesterServices } from "./academicSemester.services";
import sendResponse from "../../../shared/sendResponse";
import { AcademicSemester } from "@prisma/client";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";

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
    // console.log(req.query,'from getAll db controller');
    const filters = pick(req.query,['searchTerm','code','startMonth', 'endMonth'])
    // academicSemesterFilterableFields (use it in filters )
    const options = pick(req.query,['limit','page','sortBy','sortOrder'])

    console.log('filters:::',filters,'options::::',options);

    const result = await AcademicSemesterServices.getAllDb(filters,options)

    sendResponse<AcademicSemester[]>(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Successfully get Academic Semester Data",
        meta:result.meta,
        data:result?.data,
    })
})


const getSingleDataById  = catchAsync(async(req:Request,res:Response)=>{
   const id = req.params.id;

    const result = await AcademicSemesterServices.getSingleData(id)
    
    sendResponse<AcademicSemester>(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:`Successfully get ${id}`,
        data:result
    })
  
})
export const AcademicSemesterController ={insertDB,getAllDb,getSingleDataById}