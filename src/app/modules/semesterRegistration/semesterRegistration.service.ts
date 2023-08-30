
import { SemesterRegistration } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertDB = async (data: SemesterRegistration): Promise<SemesterRegistration> => {
  const result = await prisma.semesterRegistration.create({
    data,
  });

  return result;
};

export const SemesterRegistrationService = {insertDB};
