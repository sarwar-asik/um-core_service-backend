
import { z } from 'zod';
const createOfferedCourse = z.object({
  body: z.object({
    year: z.number({
      required_error: 'year is Required (zod)',
    }),
    title: z.string({
      required_error: 'title is Required (zod)',
    })
  }),
});

export const OfferedCourseValidation = { createOfferedCourse };


