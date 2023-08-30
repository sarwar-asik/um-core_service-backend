/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
const router = Router();
router.get('/',)

router.post('/',
validateRequest(SemesterRegistrationValidation.create),
SemesterRegistrationController.insertDB)

export const semesterRegistrationRoutes = router;
