
import { Request, Response } from "express";
import { AcademicSemesterServices } from "./academicSemester.services";
import sendResponse from "../../../shared/sendResponse";
import { AcademicSemester } from "@prisma/client";
import httpStatus from "http-status";

const insertDB  = async(req:Request,res:Response)=>{
    try {
        const data = req.body
        const result = await AcademicSemesterServices.insertDB(data)
        
        sendResponse<AcademicSemester>(res,{
            statusCode:httpStatus.CREATED,
            success:true,
            message:"Successfully created data",
            data:result
        })
        
    } catch (error) {
     console.log(error);
        
    }
}

export const AcademicSemesterController ={insertDB}