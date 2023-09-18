/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './Students.controller';
import { StudentsValidation } from './Students.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = Router();
router.post(
  '/',
  // auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(StudentsValidation.createStudents),
  StudentController.insertDB
);
router.get('/', StudentController.getAllDb);


router.get('/my-courses', auth(ENUM_USER_ROLE.STUDENT), StudentController.myCourses);
router.get('/my-academic-info', auth(ENUM_USER_ROLE.STUDENT), StudentController.getMyAcademicInfo);

// getMyCourseSchedules

router.get('/my-course-schedules',auth(ENUM_USER_ROLE.STUDENT), StudentController.getMyCoursesSchedules)

router.put(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(StudentsValidation.updateStudents),
  StudentController.updateIntoDb
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),

  StudentController.deleteFromDb
);

export const studentsRoutes = router;
