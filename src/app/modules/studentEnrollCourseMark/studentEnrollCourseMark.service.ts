import { studentEnrollCourseMarkUtils } from './studentEnrollCourseMark.utils';
import { ExamType, Prisma, PrismaClient, StudentEnrolledCourseMark, StudentEnrolledCourseStatus } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IStudentEnrolledCourseMarkFilterRequest } from './studentEnrollCourseMark.interface';

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

const getAllFromDB = async (
  filters: IStudentEnrolledCourseMarkFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
  const { limit, page } = paginationHelpers.calculatePagination(options);

  const marks = await prisma.studentEnrolledCourseMark.findMany({
      where: {
          student: {
              id: filters.studentId
          },
          academicSemester: {
              id: filters.academicSemesterId
          },
          studentEnrolledCourse: {
              course: {
                  id: filters.courseId
              }
          }
      },
      include: {
          studentEnrolledCourse: {
              include: {
                  course: true
              }
          },
          student: true
      }
  });

  return {
      meta: {
          total: marks.length,
          page,
          limit
      },
      data: marks
  };
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
    where:{
      id: studentEnrollCourseMarks.id,
    },
    data: {
      marks,
      grade,
      examType,
    },
  });

  return updateMarks;
}

const updateFinalMarks = async(payload:any)=>{
  console.log(payload);

  const {studentId,academicSemesterId,courseId} = payload
  const studentEnrollCourse = await prisma.studentEnrolledCourse.findFirst({
    where:{
      student:{
        id:studentId
      },
      academicSemester:{
        id:academicSemesterId
      },
      course:{
        id:courseId
      }
    }
  })
  if(!studentEnrollCourse){
    throw new ApiError(httpStatus.BAD_REQUEST,"studentEnrolledCourse data not found")
  }
  const studentEnrollCourseMarks = await prisma.studentEnrolledCourseMark.findMany({
    where:{
      student:{
        id:studentId
      },
      academicSemester:{
        id:academicSemesterId
      },
      studentEnrolledCourse:{
        course:{
          id:courseId
        }
      }
    }
  })
  if(!studentEnrollCourseMarks?.length){
    throw new ApiError(httpStatus.BAD_REQUEST,"studentEnrolledCourseMarks data not found")
  }

  const midTermMarks =  studentEnrollCourseMarks.find(item=>item?.examType === ExamType.MIDTERM)?.marks || 0;

  const finalTermMarks =  studentEnrollCourseMarks.find(item=>item?.examType === ExamType.FINAL)?.marks || 0
// console.log(midTermMarks,finalTermMarks);


const totalFinalMarks = Math.ceil(midTermMarks* 0.4) + Math.ceil(finalTermMarks* 0.6)  ///math used for round figure marks

console.log("🚀 totalFinalMarks:", totalFinalMarks)

const result = studentEnrollCourseMarkUtils.getGradeFromMarks(totalFinalMarks)

console.log(result,"result");

await prisma.studentEnrolledCourse.updateMany({
  where:{
    student:{
      id:studentId
    },
    academicSemester:{
      id:academicSemesterId
    },
    course:{
      id:courseId
    }
  },
  data:{
    grade:result.grade,
    point:result?.point,
    totalMarks:totalFinalMarks,
    status:StudentEnrolledCourseStatus.COMPLETED
  }
})



const grades = await prisma.studentEnrolledCourse.findMany({
  where:{
    student:{
      id:studentId
    },
    status:StudentEnrolledCourseStatus.COMPLETED
  },
  include:{
    course:true
  }
})

await studentEnrollCourseMarkUtils.calcCGPAandGrade(grades)






  return payload
}

export const StudentEnrollCourseMarkService = {
  createStudentEnrollCourseDefaultMarks,
  getAllFromDB,
  updateStudentMarks,
  updateFinalMarks
};
