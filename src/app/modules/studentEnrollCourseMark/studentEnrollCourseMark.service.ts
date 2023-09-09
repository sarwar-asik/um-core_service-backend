import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

const createStudentEnrollCourseDefaultMarks = async (
  prismaClient:Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
  payload: {
    studentId: string;
    studentEnrolledCourseId: string;
    academicSemesterId: string;
  }
) => {
  console.log('Default marks',prismaClient,payload);
};

export const StudentEnrollCourseMarkService = {
  createStudentEnrollCourseDefaultMarks,
};
