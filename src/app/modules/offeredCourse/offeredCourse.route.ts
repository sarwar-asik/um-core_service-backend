/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { OfferedCourseController } from './offeredCourse.controller';
import {OfferedCourseValidation } from './offeredCourse.validation';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
const router = Router();


router.post('/', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),validateRequest(OfferedCourseValidation.createOfferedCourse),OfferedCourseController.insertDB)

// 

router.get('/',OfferedCourseController.getAllDb);
router.get('/:id',OfferedCourseController.getSingleDataById)

export const offeredCourseRoutes = router;
