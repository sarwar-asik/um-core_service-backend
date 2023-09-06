import { SemesterRegistration, StudentSemesterRegistration, Prisma,SemesterRegistrationStatus, StudentSemesterRegistrationCourse, } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  semesterRegistrationRelationalFields,
  semesterRegistrationRelationalFieldsMapper,
  semesterRegistrationSearchableFields,
} from './semesterRegistration.constant';
import { IEnrollCoursePayload } from './semesterRegistration.interface';

const insertDB = async (
  data: SemesterRegistration
): Promise<SemesterRegistration> => {
  const isAnySemesterRegistrationUpcoming =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });
  if (isAnySemesterRegistrationUpcoming) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isAnySemesterRegistrationUpcoming?.status} registration `
    );
  }
  const result = await prisma.semesterRegistration.create({
    data,
  });

  return result;
};

type ISemesterRegistrationFilterRequest = {
  searchTerm?: string | undefined;
  academicSemesterId?: string | undefined;
};

const getAllFromDB = async (
  filters: ISemesterRegistrationFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: semesterRegistrationSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (semesterRegistrationRelationalFields.includes(key)) {
          return {
            [semesterRegistrationRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.SemesterRegistrationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.semesterRegistration.findMany({
    include: {
      academicSemester: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.semesterRegistration.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
  return result;
};

const updateOneToDB = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Data not found');
  }

  if (
    payload?.status &&
    isExist?.status === SemesterRegistrationStatus.UPCOMING &&
    payload.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from UPCOMING to ONGOING'
    );
  }

  if (
    payload?.status &&
    isExist?.status === SemesterRegistrationStatus.ONGOING &&
    payload.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from ONGOING to ENDED'
    );
  }

  const result = await prisma.semesterRegistration.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
    },
  });

  return result;
};

//! start Regestration >>>

const startMyRegistration = async (authUserId: string):Promise<{
  semesterRegistration:SemesterRegistration  | null,
  studentSemesterRegistration:StudentSemesterRegistration | null
}> => {
  // console.log(authUserId);
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });
  if (!studentInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not Found the Student');
  }
  const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMING,
        ],
      },
    },
  });

  if (
    semesterRegistrationInfo?.status === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Registration is not started yet'
    );
  }

  let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      student: {
        id: studentInfo?.id,
      },
      semesterRegistration: {
        id: semesterRegistrationInfo?.id,
      },
    },
  });

  if (!startMyRegistration) {
    studentRegistration = await prisma.studentSemesterRegistration.create({
      data: {
        student: {
          connect: {
            id: studentInfo?.id,
          },
        },
        semesterRegistration: {
          connect: {
            id: semesterRegistrationInfo?.id,
          },
        },
      },
    });
  }

  return {
    semesterRegistration:semesterRegistrationInfo,
    studentSemesterRegistration:studentRegistration
  }

}


// ! for enrollment ///

const enrollIntoCourse = async (
  id: string,
  payload:IEnrollCoursePayload
): Promise<StudentSemesterRegistrationCourse| null> => {
 console.log(id,payload,"from enroll");

 const  student = await prisma.student.findFirst({
  where:{
    studentId:id
  }
 })

 if(!student){
  throw new ApiError(httpStatus.NOT_FOUND,"Student not found")
 }
//  console.log(student);
 const semesterRegistration = await prisma.semesterRegistration.findFirst({
  where:{
    status:SemesterRegistrationStatus.ONGOING
  }
 })

 if(!semesterRegistration){
  throw new ApiError(httpStatus.NOT_FOUND,"semesterRegistration not found")
 }
 const offeredCourse = await prisma.offeredCourse.findFirst({
  where:{
   id:payload?.offeredCourseId
  },
  include:{
    course:true
  }
 })

 if(!offeredCourse){
  throw new ApiError(httpStatus.NOT_FOUND,"offered course not found")
 }
 
 const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
  where:{
   id:payload?.offeredCourseSectionId
  }
 })

 if(!offeredCourseSection){
  throw new ApiError(httpStatus.NOT_FOUND,"offered course  sectionnot found")
 }



// console.log(semesterRegistration);
// console.log(semesterRegistration?.id);

if(offeredCourseSection.maxCapacity && offeredCourseSection.currentlyEnrolledStudent && offeredCourseSection.currentlyEnrolledStudent >= offeredCourseSection.maxCapacity){
  throw new ApiError(httpStatus.BAD_REQUEST,"student capacity is full")
}


// ! with transaction 
await prisma.$transaction(async(transactionClient)=>{
  await transactionClient.studentSemesterRegistrationCourse.create({data:
    {
      studentId:student?.id,
      semesterRegistrationId:semesterRegistration?.id,
      offeredCourseId:payload.offeredCourseId,
      offeredCourseSectionId:payload?.offeredCourseSectionId
    }
  })
  await transactionClient.offeredCourseSection.update({
    where:{
      id:payload?.offeredCourseSectionId
    },
    data:{
      currentlyEnrolledStudent:{
        increment:1
      }
    }
  })

  await transactionClient.studentSemesterRegistration.updateMany({
    where:{
      student:{
        studentId:student?.id
      },
      semesterRegistration:{
        id:semesterRegistration?.id
      }
    },
    data:{
      totalCreditsTaken:{
        increment:offeredCourse?.course.credits
      }
    }
  })
})

return null
// const enrollCourse  = await prisma.studentSemesterRegistrationCourse.create({data:
//   {
//     studentId:student?.id,
//     semesterRegistrationId:semesterRegistration?.id,
//     offeredCourseId:payload.offeredCourseId,
//     offeredCourseSectionId:payload?.offeredCourseSectionId
//   }
// })

//  return enrollCourse
};


export const SemesterRegistrationService = {
  insertDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneToDB,
  startMyRegistration,
  enrollIntoCourse
};
