import { z } from 'zod';

const create = z.object({
    body: z.object({
        offeredCourseId: z.string({
            required_error: 'offeredCourseId is required'
        }),
      
        currentlyEnrolledStudent: z.number({
            required_error: 'currentlyEnrolledStudent is required'
        }),        maxCapacity: z.number({
            required_error: 'maxCapacity is required'
        }),
        title: z.string({
            required_error: 'title is required'
        })
    })
});

const update = z.object({
    body: z.object({
        maxCapacity: z.number().optional(),
        title: z.string().optional()
    })
});

export const OfferedCourseSectionValidation = {
    create,
    update
};