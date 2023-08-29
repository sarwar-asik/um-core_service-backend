import { Course, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { ICourseCreateData, IPrerequisiteCourseRequest } from './course.interface';
import { asyncForEach } from './utils';

const insertDB = async (data: ICourseCreateData): Promise<any> => {
  const { preRequisiteCourses, ...courseData } = data;

  // ! without transaction ::::

  // const result = await prisma.course.create({
  //   data: courseData,
  // });
  // if (preRequisiteCourses && preRequisiteCourses.length > 0) {
  //   for (let index = 0; index < preRequisiteCourses.length; index++) {
  //     const createPrerequiesite = await prisma.courseToPrerequisite.create({
  //       data: {
  //         courseID: result.id,
  //         prerequisiteId: preRequisiteCourses[index].courseID,
  //       },
  //     });
  //     console.log(createPrerequiesite, 'pressssssss');
  //   }
  // }

  // ! with transaction ////

  const newCourse = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.create({
      data: courseData,
    });
    if (result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found course');
    }
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // for (let index = 0; index < preRequisiteCourses.length; index++) {
      //   const createPrerequiesite =
      //     await transactionClient.courseToPrerequisite.create({
      //       data: {
      //         courseID: result?.id,
      //         prerequisiteId: preRequisiteCourses[index].courseID,
      //       },
      //     });
      //   console.log(createPrerequiesite, 'pressssssss');
      // }

      await asyncForEach(preRequisiteCourses,async(preRequisiteCourses:IPrerequisiteCourseRequest)=>{
        const createPrerequiesite =
          await transactionClient.courseToPrerequisite.create({
            data: {
              courseID: result?.id,
              prerequisiteId: preRequisiteCourses.courseID,
            },
          });
      })
    }

    return result;
  });

  // for nested data with course >>>>

  if (newCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id: newCourse?.id,
      },
      include: {
        Prerequisite: {
          include: {
            prerequisite: true,
          },
        },
        PrerequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });
    return responseData;
  }

  throw new ApiError(httpStatus.NOT_FOUND, 'unable to create course');
};

type ICourseFilterRequest = {
  searchTerm?: string;
};

const getAllDb = async (
  filters: ICourseFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Course[]>> => {
  // !for pagination
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  //   console.log('page',page,'limit',limit,'skip',skip)
  //   ! for filters

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ['title', 'code', 'credits'].map(field => ({
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

  const whereCondition: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.course.findMany({
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
      Prerequisite: true,
      PrerequisiteFor: true,
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

const getSingleData = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update courses data ///

const updateItoDb = async (
  id: string,
  payload: Partial<ICourseCreateData>
): Promise<Course | null> => {

  // console.log(id, payload);

  const { preRequisiteCourses, ...courseData } = payload;
  console.log(preRequisiteCourses);

  await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.update({
      where: {
        id,
      },
      data: courseData,
      include: {
        Prerequisite: true,
        PrerequisiteFor: true,
      },
    });

    
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update the course');
    }


    if (preRequisiteCourses && preRequisiteCourses?.length > 0) {
      const deletePrerequisite = preRequisiteCourses.filter(
        (coursePrerequisite) =>
          coursePrerequisite.courseID && coursePrerequisite?.isDeleted
      )
      const newPrerequisite = preRequisiteCourses.filter(coursePrerequisite=>
        coursePrerequisite.courseID && !coursePrerequisite.isDeleted)
        

        for (let index=0 ; index< deletePrerequisite.length ; index++){
          await transactionClient.courseToPrerequisite.deleteMany({
            where:{
              AND:[
                {
                  courseID:id
                },
                {
                  prerequisiteId:deletePrerequisite[index].courseID
                }
              ]
            }
          })
        }

        for(let index = 0 ;index <newPrerequisite.length;index++){
          await transactionClient.courseToPrerequisite.create({
            data:{
              courseID:id,
              prerequisiteId:newPrerequisite[index].courseID
            }
          })
        }

        // await asyncForEach(pre)
    }
    return result
    
  })




  const responseData = await prisma.course.findUnique({
    where: {
      id
    },
    include: {
      Prerequisite: {
        include: {
          prerequisite: true,
        },
      },
      PrerequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });
  return responseData;
          
};

// for delete data.....

const deleteFromDb = async (id: string): Promise<Course> => {
  const result = await prisma.course.delete({
    where: {
      id,
    },
    // include:{
    //   rooms:true
    // }
  });

  return result;
};

export const CoursesService = {
  insertDB,
  getAllDb,
  getSingleData,
  updateItoDb,
  deleteFromDb,
};
