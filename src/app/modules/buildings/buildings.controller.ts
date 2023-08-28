import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { BuildingsService } from "./buildings.service";
import { Building } from "@prisma/client";
import pick from "../../../shared/pick";

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
  
const getAllDb = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query,'from getAll db controller');
    const filters = pick(req.query, [
      'searchTerm',
    'title'
    ]);
    // BuildingFilterableFields (use it in filters )
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  
    // console.log('filters:::',filters,'options::::',options);
  
    const result = await BuildingsService.getAllDb(filters, options);
  
    sendResponse<Building[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Successfully get Building Data',
      meta: result.meta,
      data: result?.data,
    });
  });
  
  const getSingleDataById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
  
    const result = await BuildingsService.getSingleData(id);
  
    sendResponse<Building>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Successfully get ${id}`,
      data: result,
    });
  });
  const updateIntoDb = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
  const data = req?.body;
  
    const result = await BuildingsService.updateItoDb(id,data);
  
    sendResponse<Building>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Successfully updated ${id}`,
      data: result,
    });
  });
  const deleteFromDb = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
  
  
    const result = await BuildingsService.deleteFromDb(id)
  
    sendResponse<Building>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Successfully deleted ${id}`,
      data: result,
    });
  });

export const BuildingsController = {insertDB,getAllDb,getSingleDataById,deleteFromDb,updateIntoDb};
