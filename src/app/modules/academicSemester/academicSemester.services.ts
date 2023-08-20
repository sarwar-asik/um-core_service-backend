import { AcademicSemester, PrismaClient } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';

const prisma = new PrismaClient();

const insertDB = async (data: AcademicSemester): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({
    data,
  });

  return result;
};

const getAllDb =async (filter,options:IPaginationOptions):Promise<IGenericResponse<AcademicSemester[]>> => {

  const {page,limit,skip} = paginationHelpers.calculatePagination(options)

//   console.log('page',page,'limit',limit,'skip',skip)



  const result = await  prisma.academicSemester.findMany(
  {
    skip,
    take:limit
  }
  )
  const     total = await prisma.academicSemester.count()
  return {
    meta:{
        total,
        page,
        limit
    },
    data:result
  }
}

export const AcademicSemesterServices = { insertDB,getAllDb };
