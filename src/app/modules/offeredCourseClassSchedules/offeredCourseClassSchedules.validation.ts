
import { z } from 'zod';

const createOfferedCourseClassSchedules = z.object({
  body: z.object({
    startTime: z.string({
      required_error: 'startTime is Required (zod)',
    }),
    endTime: z.string({
      required_error: 'endTime is Required (zod)',
    }),
    dayOfWeek: z.string({
      required_error: 'dayOfWeek is Required (zod)',
    }),
    offeredCourseSectionId: z.string({
      required_error: 'offeredCourseSectionId is Required (zod)',
    }),
    semesterRegistrationId: z.string({
      required_error: 'semesterRegistrationId is Required (zod)',
    }),
    roomId: z.string({
      required_error: 'roomId is Required (zod)',
    }),
    facultyId: z.string({
      required_error: 'facultyId is Required (zod)',
    })
  }),
});

export const OfferedCourseClassSchedulesValidation = { createOfferedCourseClassSchedules };


