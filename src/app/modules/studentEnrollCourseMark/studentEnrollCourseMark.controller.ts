import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { StudentEnrollCourseMarkService } from "./studentEnrollCourseMark.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { studentEnrolledCourseMarkFilterableFields } from "./studentEnrollCourseMark.conts";


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await StudentEnrollCourseMarkService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student course marks fetched successfully',
        meta: result.meta,
        data: result.data
    });
});

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
    getAllFromDB,
    updateStudentMarks,
    updateFinalMarks
}