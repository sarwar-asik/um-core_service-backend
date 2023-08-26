/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './Students.controller';
import { StudentsValidation } from './Students.validation';
const router = Router();
router.post(
  '/',
  validateRequest(StudentsValidation.createStudents),
  StudentController.insertDB
);
router.get('/', StudentController.getAllDb);

export const studentsRoutes = router;
