import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";


import pick from "../../../shared/pick";
import { RoomsService } from "./rooms.service";
import { Room } from "@prisma/client";


const insertDB = catchAsync(async (req: Request, res: Response) => {
    const data = req.body;
    const result = await RoomsService.insertDB(data)
  
    sendResponse<Room>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Successfully Room',
      data: result,
    });
  });
  
const getAllDb = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query,'from getAll db controller');
    const filters = pick(req.query, [
      'searchTerm',
      'roomNumber','floor'
    ]);
    // RoomFilterableFields (use it in filters )
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  
    // console.log('filters:::',filters,'options::::',options);
  
    const result = await RoomsService.getAllDb(filters, options);
  
    sendResponse<Room[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Successfully get Room Data',
      meta: result.meta,
      data: result?.data,
    });
  });
  
  const getSingleDataById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
  
    const result = await RoomsService.getSingleData(id);
  
    sendResponse<Room>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Successfully get ${id}`,
      data: result,
    });
  });
  const updateIntoDb = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
  const data = req?.body;
  
    const result = await RoomsService.updateItoDb(id,data);
  
    sendResponse<Room>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Successfully updated ${id}`,
      data: result,
    });
  });
  const deleteFromDb = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
  
  
    const result = await RoomsService.deleteFromDb(id)
  
    sendResponse<Room>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Successfully deleted ${id}`,
      data: result,
    });
  });

export const RoomsController = {insertDB,getAllDb,getSingleDataById,deleteFromDb,updateIntoDb};
