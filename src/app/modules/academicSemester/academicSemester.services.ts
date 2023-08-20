import { AcademicSeemestar, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const insertDB = async (
  data: AcademicSeemestar
): Promise<AcademicSeemestar> => {
  const result = await prisma.academicSeemestar.create({
    data,
  });

  return result;
};

export const AcademicSemesterServices = { insertDB };
