import { OfferedCourse, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../courses/utils';
import { ICreateOfferedCourse } from './offered.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const insertDB = async (
  data: ICreateOfferedCourse
): Promise<OfferedCourse[]> => {
  const { courseIds, academicDepartmentId, semesterRegistrationId } = data;

  const result: OfferedCourse[] = [];

  await asyncForEach(courseIds, async (courseId: string) => {
    const alreadyExist = await prisma.offeredCourse.findFirst({
      where: {
        courseId,
        academicDepartmentId,
        semesterRegistrationId,
      },
    });

    if (!alreadyExist) {
      const insertOfferedCourse = await prisma.offeredCourse.create({
        data: {
          academicDepartmentId,
          semesterRegistrationId,
          courseId,
        },
        include: {
          course: true,
          academicDepartment: true,
          semesterRegistration: true,
        },
      });
      result.push(insertOfferedCourse);
    }
  });

  return result;
};



type IOfferedCourseFilterRequest = {
  searchTerm?: string;
};

const getAllDb = async (
  filters: IOfferedCourseFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourse[]>> => {
  // !for pagination
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  //   console.log('page',page,'limit',limit,'skip',skip)
  //   ! for filters

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ['courseId','academicDepartmentId','semesterRegistrationId'].map(field => ({
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

  const whereCondition: Prisma.OfferedCourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offeredCourse.findMany({
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
          include: {
            course: true,
            academicDepartment: true,
            semesterRegistration: true,
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

const getSingleData = async (id: string): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.findUnique({
    where: {
      id,
    },
  });

  return result;
};
export const OfferedCourseService = { insertDB,getAllDb,getSingleData };
