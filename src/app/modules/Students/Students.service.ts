import {
  Prisma,
  Student,
  StudentEnrolledCourse,
  StudentEnrolledCourseStatus,
} from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { StudentUtils } from './Student.Utils';

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

const updateItoDb = async (
  id: string,
  payload: Partial<Student>
): Promise<Student> => {
  console.log(id, payload);
  const result = await prisma.student.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteFromDb = async (id: string): Promise<Student> => {
  const result = await prisma.student.delete({
    where: {
      id,
    },
    include: {
      academicDepartment: true,
      academicFaculty: true,
    },
  });

  return result;
};

const myCourses = async (
  authId: string,
  filter: {
    courseId?: string | undefined;
    academicSemesterId?: string | undefined;
  }
): Promise<StudentEnrolledCourse[]> => {
  // console.log(authId);
  // console.log(filter);

  if (!filter?.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    filter.academicSemesterId = currentSemester?.id;

    // console.log(currentSemester)
  }

  // console.log("...filter",{...filter});

  const result = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: authId,
      },
      //! !important for filter by destructure
      ...filter,
    },
    include: {
      course: true,
    },
  });

  return result;
};

const getMyCourseSchedules = async (
  authId: string,
  filter: {
    courseId?: string | undefined;
    academicSemesterId?: string | undefined;
  }
) => {
  // console.log(authId,filter);
  if (!filter?.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    filter.academicSemesterId = currentSemester?.id;

    // console.log(currentSemester)
  }
  console.log(authId);

  const studentEnrolledCourses = await myCourses(authId, filter);

  // console.log(studentEnrolledCourses);
  //  return studentEnrolledCourses

  const studentEnrolledCourseIds = studentEnrolledCourses?.map(
    (item: StudentEnrolledCourse) => item.courseId
  );

  const result = await prisma.studentSemesterRegistrationCourse.findMany({
    where: {
      student: {
        studentId: authId,
      },
      semesterRegistration: {
        academicSemester: {
          id: filter.academicSemesterId,
        },
      },
      offeredCourse: {
        course: {
          id: {
            // ! !important in . here studentEnrolledCourseIds is a Array[]
            in: studentEnrolledCourseIds,
          },
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseSection: {
        include: {
          offeredCourseClassSchedule: {
            include: {
              room: {
                include: {
                  building: true,
                },
              },
              faculty: true,
            },
          },
        },
      },
    },
  });

  return result;
};

const getMyAcademicInfo = async (authUserId: string): Promise<any> => {
  console.log(authUserId, 'authUserid');
  const academicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      student: {
        studentId: authUserId,
      },
    },
  });
  // console.log(academicInfo);
  const enrolledCourses = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
    include: {
      course: true,
      academicSemester: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })


  const groupByAcademicSemesterData =
    StudentUtils.groupByAcademicSemester(enrolledCourses);

  return { academicInfo, course:groupByAcademicSemesterData };
};

export const StudentsService = {
  insertDB,
  getAllDb,
  getSingleData,
  updateItoDb,
  deleteFromDb,
  myCourses,
  getMyCourseSchedules,
  getMyAcademicInfo,
};
