
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import {  Prisma ,Course} from "@prisma/client";


const insertDB = async (data: Course): Promise<Course> => {
  const {preRequisiteCourses,...courseData} = data
  const result = await prisma.course.create({
    data:courseData
  });
  if(preRequisiteCourses && preRequisiteCourses.length>0){
  for (let index =0 ; index < preRequisiteCourses.length; index++){
    const createPrerequiesite = await prisma.courseToPrerequisite.create({
      data:{
        courseID:result.id,
        prerequisiteId:preRequisiteCourses[index].courseId

      }
    })
    console.log(createPrerequiesite,"pressssssss");
  }
  }

  return result;
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
      OR: ["title","code","credits"].map(
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
          // include:{
          //   room:true
          // }
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



const updateItoDb = async(id:string,payload:Partial<Course>):Promise<Course>=>{

  console.log(id,payload);
  const result =await prisma.course.update({
    where:{
      id
    },
    data:payload
  })

  return result

}

const deleteFromDb = async(id:string):Promise<Course>=>{


  const result =await prisma.course.delete({
    where:{
      id
    },
    // include:{
    //   rooms:true
    // }
  })

  return result

}


export const CoursesService = {insertDB,getAllDb,getSingleData,updateItoDb,deleteFromDb};
