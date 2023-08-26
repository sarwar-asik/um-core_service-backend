import prisma from "../../../shared/prisma";



const insertDB = async (data: Students): Promise<Students> => {
  const result = await prisma.Students.create({
    data,
  });

  return result;
};

export const StudentsService = {insertDB};
