import { z } from 'zod';
const createStudents = z.object({
  body: z.object({
    studentID: z.string({
      required_error: 'studentID is Required (zod)',
    }),
    firstName: z.string({
      required_error: 'firstName is Required (zod)',
    }),
    lastName: z.string({
      required_error: 'lastName is Required (zod)',
    }),
    middleName: z.string({
      required_error: 'middleName is Required (zod)',
    }),
    profileImage: z.string({
      required_error: 'profileImage is Required (zod)',
    }),
    email: z.string({
      required_error: 'email is Required (zod)',
    }),
    contactNo: z.string({
      required_error: 'contactNo is Required (zod)',
    }),
    gendar: z.string({
      required_error: 'gendar is Required (zod)',
    }),
    bloodGroup: z.string({
      required_error: 'bloodGroup is Required (zod)',
    }),
    academicSemestarId: z.string({
      required_error: 'academicSemestarId is Required (zod)',
    }),
    academicDepartmentId: z.string({
      required_error: 'academicDepartmentId is Required (zod)',
    }),
    academicFacultyId: z.string({
      required_error: 'academicFacultyId is Required (zod)',
    }),
  }),
});
const updateStudents = z.object({
  body: z.object({
    studentID: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    profileImage: z.string().optional(),
    email: z.string().optional(),
    contactNo: z.string().optional(),
    gendar: z.string().optional(),
    bloodGroup: z.string().optional(),
    academicSemestarId: z.string().optional(),
    academicDepartmentId: z.string().optional(),
    academicFacultyId: z.string().optional(),
  }),
});

export const StudentsValidation = { createStudents, updateStudents };
