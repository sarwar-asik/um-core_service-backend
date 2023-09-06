/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { OfferedCourseSectionController } from './offeredCourseSection.controller';
import {OfferedCourseSectionValidation } from './offeredCourseSection.validation';
import validateRequest from '../../middlewares/validateRequest';
const router = Router();
router.post('/',validateRequest(OfferedCourseSectionValidation.create),OfferedCourseSectionController.insertDB)
router.get('/',OfferedCourseSectionController.getAllDB)

export const offeredCourseSectionRoutes = router;
