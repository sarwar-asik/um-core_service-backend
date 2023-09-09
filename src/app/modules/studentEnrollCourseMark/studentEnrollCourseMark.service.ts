import { ExamType, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

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





const updateStudentMarks = async(payload:any)=>{
    console.log(payload);
    return payload
}




export const StudentEnrollCourseMarkService = {
  createStudentEnrollCourseDefaultMarks,
  updateStudentMarks
};
