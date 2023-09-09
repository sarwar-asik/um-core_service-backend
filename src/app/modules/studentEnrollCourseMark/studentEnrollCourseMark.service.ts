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


//   created for midTime ///

  await prismaClient.studentEnrolledCourseMark.create({
    data:{
        // ! !important used connect in studentEnrollMark
        
        student:{
            connect:{
                id:payload?.studentId
            }
        },
        studentEnrolledCourse:{
            connect:{
                id:payload?.studentEnrolledCourseId
            }
        },
        academicSemester:{
            connect:{
                id:payload?.academicSemesterId
            }
        },
        examType:ExamType.MIDTERM
    }
  })

//   created for final
  await prismaClient.studentEnrolledCourseMark.create({
    data:{
        // ! !important used connect in studentEnrollMark

        student:{
            connect:{
                id:payload?.studentId
            }
        },
        studentEnrolledCourse:{
            connect:{
                id:payload?.studentEnrolledCourseId
            }
        },
        academicSemester:{
            connect:{
                id:payload?.academicSemesterId
            }
        },
        examType:ExamType.FINAL
    }
  })
};

export const StudentEnrollCourseMarkService = {
  createStudentEnrollCourseDefaultMarks,
};
