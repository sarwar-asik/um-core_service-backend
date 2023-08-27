
import { z } from 'zod';
const createBuildings = z.object({
  body: z.object({
  
    title: z.string({
      required_error: 'title is Required (zod)',
    })
  }),
});

export const BuildingsValidation = { createBuildings };


