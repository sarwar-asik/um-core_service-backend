import { studentEnrollCourseMarkUtils } from './studentEnrollCourseMark.utils';
import { ExamType, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const createStudentEnrollCourseDefaultMarks = async (
  prismaClient: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: {
    studentId: string;
    studentEnrolledCourseId: string;
    academicSemesterId: string;
  }
) => {
  console.log('Default marks', prismaClient, payload);

  const isExistMidTermData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.MIDTERM,
        student: {
          id: payload?.studentId,
        },
        studentEnrolledCourse: {
          id: payload?.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });

  if (!isExistMidTermData) {
    //   created for midTime ///

    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        // ! !important used connect in studentEnrollMark

        student: {
          connect: {
            id: payload?.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload?.studentEnrolledCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload?.academicSemesterId,
          },
        },
        examType: ExamType.MIDTERM,
      },
    });
  }
  const isExistFinalData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.FINAL,
        student: {
          id: payload?.studentId,
        },
        studentEnrolledCourse: {
          id: payload?.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });

  if (!isExistFinalData) {
    //   created for midTime ///

    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        // ! !important used connect in studentEnrollMark

        student: {
          connect: {
            id: payload?.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload?.studentEnrolledCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload?.academicSemesterId,
          },
        },
        examType: ExamType.FINAL,
      },
    });
  }
};

const updateStudentMarks = async (payload: any) => {
  // console.log(payload);

  const { studentId, academicSemesterId, courseId, examType, marks } = payload;

  const studentEnrollCourseMarks =
    await prisma.studentEnrolledCourseMark.findFirst({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
      },
    });

  if (!studentEnrollCourseMarks) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student enrolled course mark not found '
    );
  }

 const {grade} = studentEnrollCourseMarkUtils.getGradeFromMarks(marks)


  const updateMarks = await prisma.studentEnrolledCourseMark.update({
    where: {
      id: studentEnrollCourseMarks.id,
    },
    data: {
      marks,
      grade,
      examType,
    },
  });

  return updateMarks;
};

export const StudentEnrollCourseMarkService = {
  createStudentEnrollCourseDefaultMarks,
  updateStudentMarks,
};
