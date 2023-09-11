import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { StudentEnrollCourseMarkService } from "./studentEnrollCourseMark.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";


const updateStudentMarks = catchAsync(async(req:Request,res:Response)=>{
    const result = await StudentEnrollCourseMarkService.updateStudentMarks(req?.body)


    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"marks updated mark",
        data:result
    })
})
const updateFinalMarks = catchAsync(async(req:Request,res:Response)=>{
    const result = await StudentEnrollCourseMarkService.updateFinalMarks(req?.body)


    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:" updated Final mark",
        data:result
    })
})


export const StudentEnrollCourseMarkController ={
    updateStudentMarks,
    updateFinalMarks
}