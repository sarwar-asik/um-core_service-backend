import { AcademicSemester, PrismaClient } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';

const prisma = new PrismaClient();

const insertDB = async (data: AcademicSemester): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({
    data,
  });

  return result;
};

const getAllDb =async ():Promise<IGenericResponse<AcademicSemester[]>> => {
  const result = await  prisma.academicSemester.findMany()
  const     total = await prisma.academicSemester.count()
  return {
    meta:{
        total,
        page:1,
        limit:10
    },
    data:result
  }
}

export const AcademicSemesterServices = { insertDB,getAllDb };
