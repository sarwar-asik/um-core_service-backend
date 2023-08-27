
import { Building } from "@prisma/client";
import prisma from "../../../shared/prisma";


const insertDB = async (data: Building): Promise<Building> => {
  const result = await prisma.building.create({
    data,
  });

  return result;
};

export const BuildingsService = {insertDB};
