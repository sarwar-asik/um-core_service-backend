import { AcademicSemester, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IAcademicSemesterFilterRequest } from './academicSemester.Interface';

const insertDB = async (data: AcademicSemester): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({
    data,
  });

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

const myCourses = async (
  authUser: {
    userId: string;
    role: string;
  },
  filter: {
    academicSemesterId?: string | null | undefined;
    courseId?: string | null | undefined;
  }
): Promise<CourseFaculty[] | null | any> => {
  console.log(authUser, 'auth id', filter);

  if (!filter?.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    filter.academicSemesterId = currentSemester?.id;
  }

  const offeredCourseSection = prisma.offeredCourseSection.findFirst({
    where: {
      offeredCourseClassSchedule: {
        // ! !important for best query by this or other

        some: {
          faculty: {
            facultyId: authUser?.userId,
          },
        },
      },
      offeredCourse:{
        semesterRegistration:{
            academicSemester:{
                id:filter.academicSemesterId
            }
        }
      }
    },
    include:{
        offeredCourse:{
            include:{
                course:true
            }
        },
        offeredCourseClassSchedule:{
            include:{
                room:{
                    include:{
                        building:true
                    }
                },
                faculty:{
                    include:{
                        courses:true
                    }
                }
            }
        }
    }

  });

  return offeredCourseSection;
};
export const AcademicSemesterServices = { insertDB, getAllDb, getSingleData };
