/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';

import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { CoursesController } from './courses.controller';
import { CoursesValidation } from './courses.validation';
const router = Router();
router.get('/',CoursesController.getAllDb);
router.post(
  '/',
  // auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.FACULTY,ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(CoursesValidation.createCourses),
  CoursesController.insertDB
);

router.get('/:id',CoursesController.getSingleDataById)

router.put('/:id',CoursesController.updateIntoDb)
router.delete('/:id',CoursesController.updateIntoDb)

router.post("/:id/assign-faculties",CoursesController.assignFaculties)

router.delete("/:id/remove-faculties",CoursesController.removeFaculties)

export const coursesRoutes = router;
