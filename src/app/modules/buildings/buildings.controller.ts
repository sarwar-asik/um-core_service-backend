import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { BuildingsService } from "./buildings.service";
import { Building } from "@prisma/client";

const insertDB = catchAsync(async (req: Request, res: Response) => {
    const data = req.body;
    const result = await BuildingsService.insertDB(data)
  
    sendResponse<Building>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Successfully Building',
      data: result,
    });
  });
  

export const BuildingsController = {insertDB};
