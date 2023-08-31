
import { z } from 'zod';
const createOfferedCourse = z.object({
  body: z.object({
    courseIds: z.array(
      z.string({
        required_error: 'courseId is Required (zod)'
      }),
      {
        required_error:"courseIds is required (zod)"
      }
    ),
    academicDepartmentId: z.string({
      required_error: 'academicDepartmentId is Required (zod)',
    }),
    semesterRegistrationId: z.string({
      required_error: 'semesterRegistrationId is Required (zod)',
    }),
  }),
});

export const OfferedCourseValidation = { createOfferedCourse };


