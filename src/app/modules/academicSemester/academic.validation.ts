import { z } from 'zod';

const createAcademicSemester = z.object({
  body: z.object({
    year: z.number({
      required_error: 'year is Required (zod)',
    }),
    title: z.string({
      required_error: 'title is Required (zod)',
    }),
    code: z.string({
      required_error: 'code is Required (zod)',
    }),
    startMonth: z.string({
      required_error: 'startMonth is Required (zod)',
    }),
    endMonth: z.string({
      required_error: 'endMonth is Required (zod)',
    }),
  }),
});

export const AcademicSemesterValidation = { createAcademicSemester };
