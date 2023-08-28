import { z } from 'zod';
const createCourses = z.object({
  body: z.object({
  
    title: z.string({
      required_error: 'title is Required (zod)',
    }),
    code: z.string({
      required_error: 'code is Required (zod)',
    }),
    credits: z.string({
      required_error: 'credits is Required (zod)',
    }),
  })
})


const updateCourses = z.object({
  body: z.object({
    title: z.string({
      required_error: 'title is Required (zod)',
    }).optional(),
    code: z.string({
      required_error: 'code is Required (zod)',
    }).optional(),
    credits: z.string({
      required_error: 'credits is Required (zod)',
    }).optional(),
  })
})


export const CoursesValidation = { createCourses,updateCourses}

