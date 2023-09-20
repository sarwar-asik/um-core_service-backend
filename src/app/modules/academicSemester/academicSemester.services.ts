import { AcademicSemester, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IAcademicSemesterFilterRequest } from './academicSemester.Interface';
import { EVENT_ACADEMIC_SEMESTER_CREATED, academicSemesterTitleCodeMapper } from './academicSemester.constant';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { RedisClient } from '../../../shared/redis';

const insertDB = async (semesterData: AcademicSemester): Promise<AcademicSemester> => {

  
  if (academicSemesterTitleCodeMapper[semesterData.title] !== semesterData.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester Code');
  }


  const result = await prisma.academicSemester.create({
    data:semesterData
  });

  
  // ! for publish in Redis ::::
  if(result){
    await RedisClient.publish(EVENT_ACADEMIC_SEMESTER_CREATED,JSON.stringify(result));

  }
  

  return result;
};

const getAllDb = async (
  filters: IAcademicSemesterFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  // !for pagination
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  //   console.log('page',page,'limit',limit,'skip',skip)
  //   ! for filters

  console.log(filters, 'ffffff');
  const { searchTerm, ...filtersData } = filters;
  console.log(
    '🚀 ~ file: academicSemester.services.ts:29 ~ filtersData:',
    filtersData
  );

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ['title', 'code', 'startMonth', 'endMonth'].map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
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

  const whereCondition: Prisma.AcademicSemesterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.academicSemester.findMany({
    // where: {
    //   OR: [
    //     {
    //       title: {
    //         contains: searchTerm,
    //         mode: 'insensitive',
    //       },
    //     },
    //     {
    //       code: {
    //         contains: searchTerm,
    //         mode: 'insensitive',
    //       },
    //     },
    //   ],
    // },
    where: whereCondition,
    skip,
    take: limit,
    // orderBy:{
    //     createdAt:'desc'
    // }
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
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

const getSingleData = async (id: string): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.findUnique({
    where: {
      id,
    },
  })

  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<AcademicSemester>
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.update({
      where: {
          id
      },
      data: payload
  });
  // if (result) {
  //     await RedisClient.publish(EVENT_ACADEMIC_SEMESTER_UPDATED, JSON.stringify(result))
  // }
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.delete({
      where: {
          id
      }
  });

  // if (result) {
  //     await RedisClient.publish(EVENT_ACADEMIC_SEMESTER_DELETED, JSON.stringify(result));
  // }
  return result
};


export const AcademicSemesterServices = { insertDB, getAllDb, getSingleData,updateOneInDB,deleteByIdFromDB };
