
import { Prisma, Room, } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";


const insertDB = async (data: Room): Promise<Room> => {
  const result = await prisma.room.create({
    data,
  });

  return result;
};

type IRoomFilterRequest = {
  searchTerm?: string;
};



const getAllDb = async (
  filters: IRoomFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Room[]>> => {
  // !for pagination
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  //   console.log('page',page,'limit',limit,'skip',skip)
  //   ! for filters

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ['roomNumber','floor'].map(
        field => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })
      ),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => ({
        [key]: {
          equals: (filtersData as any)[key],
        },
      })),
    });
  }

  // for andCondition for where

  const whereCondition: Prisma.RoomWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.room.findMany({
    where: whereCondition,
    skip,
    take: limit,

    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
          include:{
            building:true
          }
  });
  const total = await prisma.academicSemester.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleData = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.findUnique({
    where: {
      id,
    },
  });

  return result;
};



const updateItoDb = async(id:string,payload:Partial<Room>):Promise<Room>=>{

  console.log(id,payload);
  const result =await prisma.room.update({
    where:{
      id
    },
    data:payload
  })

  return result

}

const deleteFromDb = async(id:string):Promise<Room>=>{


  const result =await prisma.room.delete({
    where:{
      id
    },
    include:{
      building:true
    }
  })

  return result

}


export const RoomsService = {insertDB,getAllDb,getSingleData,updateItoDb,deleteFromDb};
