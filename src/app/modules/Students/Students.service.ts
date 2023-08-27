import { Prisma, Student } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

const insertDB = async (data: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data,
  });
  return result;
};

type IStudentFilterRequest = {
  searchTerm?: string;
};

const getAllDb = async (
  filters: IStudentFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  // !for pagination
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  //   console.log('page',page,'limit',limit,'skip',skip)
  //   ! for filters

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ['firstName', 'email', 'contactNo', 'academicSemestarId'].map(
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

  const whereCondition: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.student.findMany({
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

const getSingleData = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: {
      id,
    },
  });

  return result;
};



const updateItoDb = async(id:string,payload:Partial<Student>):Promise<Student>=>{

  console.log(id,payload);
  const result =await prisma.student.update({
    where:{
      id
    },
    data:payload
  })

  return result

}

const deleteFromDb = async(id:string):Promise<Student>=>{


  const result =await prisma.student.delete({
    where:{
      id
    },
    include:{
      academicDepartment:true,
      academicFaculty:true
    }
  })

  return result

}
export const StudentsService = { insertDB, getAllDb, getSingleData ,updateItoDb,deleteFromDb};
