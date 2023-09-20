import { z } from 'zod';
import { academicSemesterCodes, academicSemesterMonths, academicSemesterTitles } from './academicSemester.constant';

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

const update = z.object({
  body: z.object({
      title: z.enum([...academicSemesterTitles] as [string, ...string[]]).optional(),
      code: z.enum([...academicSemesterCodes] as [string, ...string[]]).optional(),
      year: z.number().optional(),
      startMonth: z.enum([...academicSemesterMonths] as [string, ...string[]]).optional(),
      endMonth: z.enum([...academicSemesterMonths] as [string, ...string[]]).optional()
  })
});

export const AcademicSemesterValidation = {
  createAcademicSemester,
  update
}