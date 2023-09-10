import {
  Course,
  OfferedCourse,
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
  StudentSemesterRegistrationCourse,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../courses/utils';
import { StudentEnrollCourseMarkService } from '../studentEnrollCourseMark/studentEnrollCourseMark.service';
import { StudentSemesterPaymentService } from '../studentSemesterPayment/semesterRegistration.service';
import { studentSemesterRegistrationCourseService } from '../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.services';
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

const startMyRegistration = async (
  authUserId: string
): Promise<{
  semesterRegistration: SemesterRegistration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  console.log(authUserId, 'autUserId');
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });
  console.log(studentInfo, 'studentInfo');

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

  if (!studentRegistration) {
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
    // console.log(studentRegistration,"console.log(studentRegistration);");
  }

  return {
    semesterRegistration: semesterRegistrationInfo,
    studentSemesterRegistration: studentRegistration,
  };
};

// ! for enrollment ///

const enrollIntoCourse = async (
  authUserId: string,
  payload: IEnrollCoursePayload
): Promise<{ message: string }> => {
  return studentSemesterRegistrationCourseService.enrollIntoCourse(
    authUserId,
    payload
  );
};

// ! for withdraw ////

const withdrawFromCourse = async (
  authUserId: string,
  payload: IEnrollCoursePayload
): Promise<{ message: string }> => {
  return studentSemesterRegistrationCourseService.withdrawFromCourse(
    authUserId,
    payload
  );
};

const confirmMyRegistration = async (
  authUserId: string
): Promise<{ message: string }> => {
  console.log(
    '🚀 ~ file: semesterRegistration.service.ts:299 ~ authUserId:',
    authUserId
  );

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });
  // console.log(authUserId,"semesterRegistration.id",semesterRegistration?.id,);
  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
    });

  // console.log(studentSemesterRegistration,"");

  if (!studentSemesterRegistration) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You were not registration yet');
  }

  if (studentSemesterRegistration.totalCreditsTaken === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You are not enroll to any course`
    );
  }
  if (
    studentSemesterRegistration.totalCreditsTaken &&
    semesterRegistration?.minCredit &&
    semesterRegistration?.maxCredit &&
    (studentSemesterRegistration.totalCreditsTaken <
      semesterRegistration?.minCredit ||
      studentSemesterRegistration.totalCreditsTaken >
        semesterRegistration?.maxCredit)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can take only ${semesterRegistration?.minCredit} to ${semesterRegistration?.maxCredit}`
    );
  }

  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistration.id,
    },
    data: {
      isConfirmed: true,
    },
  });

  // console.log(studentSemesterRegistration,authUserId,semesterRegistration);

  return { message: 'Your registration is confirmed' };
};

const getMyRegistration = async (authUserId: string) => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
    include: {
      academicSemester: true,
    },
  });

  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
      include: {
        student: true,
      },
    });
  return { semesterRegistration, studentSemesterRegistration };
};

// start new semester /

const startNewSemester = async (id: string) => {
  // console.log(id,"started new semester registration");
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }
  if (semesterRegistration.status !== SemesterRegistrationStatus.ENDED) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Semester Registration is not ENDED yet'
    );
  }

  if (semesterRegistration.academicSemester.isCurrent) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semester Registration is already started'
    );
  }

  await prisma.$transaction(async prismaTransactionClient => {
    await prismaTransactionClient.academicSemester.updateMany({
      where: {
        isCurrent: true,
      },
      data: {
        isCurrent: false,
      },
    });
    await prismaTransactionClient.academicSemester.update({
      where: {
        id: semesterRegistration.academicSemester.id,
      },
      data: {
        isCurrent: true,
      },
    });

    // find enrolled student ///

    const studentSemesterRegistrationCheck =
      await prisma.studentSemesterRegistration.findMany({
        where: {
          semesterRegistration: {
            id,
          },
          isConfirmed: true,
        },
      });

    console.log(studentSemesterRegistrationCheck);

    asyncForEach(
      studentSemesterRegistrationCheck,
      async (studentSemReg: StudentSemesterRegistration) => {
        //! student payment

        if (studentSemReg?.totalCreditsTaken) {
          const totalPaymentAmount = studentSemReg.totalCreditsTaken * 5000;

          await StudentSemesterPaymentService.createSemesterPayment(
            prismaTransactionClient,
            {
              studentId: studentSemReg?.studentId,
              academicSemesterId: semesterRegistration.academicSemesterId,
              totalPaymentAmount,
            }
          );
        }

        //  console.log(studentSemReg);
        const studentSemesterRegistrationCourse =
          await prismaTransactionClient.studentSemesterRegistrationCourse.findMany(
            {
              where: {
                semesterRegistration: {
                  id,
                },

                student: {
                  id: studentSemReg?.studentId,
                },
              },
              include: {
                offeredCourse: {
                  include: {
                    course: true,
                  },
                },
              },
            }
          );
        console.log(studentSemesterRegistrationCourse);
        asyncForEach(
          studentSemesterRegistrationCourse,
          async (
            item: StudentSemesterRegistrationCourse & {
              offeredCourse: OfferedCourse & { course: Course };
            }
          ) => {
            // console.log(item);
            const isExistData =
              await prismaTransactionClient.studentEnrolledCourse.findFirst({
                where: {
                  studentId: item.studentId,
                  courseId: item?.offeredCourse?.courseId,
                  academicSemesterId: semesterRegistration.academicSemesterId,
                },
              });
            if (!isExistData) {
              const enrolledCourseData = {
                studentId: item.studentId,
                courseId: item?.offeredCourse?.courseId,
                academicSemesterId: semesterRegistration.academicSemesterId,
              };

              const studentEnrolledCourseData =
                await prismaTransactionClient.studentEnrolledCourse.create({
                  data: enrolledCourseData,
                });

              await StudentEnrollCourseMarkService.createStudentEnrollCourseDefaultMarks(
                prismaTransactionClient,
                {
                  studentId: item?.studentId,
                  studentEnrolledCourseId: studentEnrolledCourseData?.id,
                  academicSemesterId: semesterRegistration?.academicSemesterId,
                }
              );
            }
          }
        );
      }
    );
  });

  return {
    message: 'Semester Started successfully',
  };
};

export const SemesterRegistrationService = {
  insertDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneToDB,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester,
};
