/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseClassSchedulesController } from './offeredCourseClassSchedules.controller';
import { OfferedCourseClassSchedulesValidation } from './offeredCourseClassSchedules.validation';
const router = Router();
router.post(
  '/',
  validateRequest(
    OfferedCourseClassSchedulesValidation.createOfferedCourseClassSchedules
  ),
  OfferedCourseClassSchedulesController.insertDB
);
router.get('/',OfferedCourseClassSchedulesController.getAllDb);
router.get('/:id',OfferedCourseClassSchedulesController.getSingleDataById);

export const offeredCourseClassSchedulesRoutes = router;
