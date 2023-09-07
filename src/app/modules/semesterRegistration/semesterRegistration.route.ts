/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = Router();


router.get('/',SemesterRegistrationController.getAllFromDB)
router.get('/:id',SemesterRegistrationController.getByIdFromDB)

router.post('/',
validateRequest(SemesterRegistrationValidation.create),
SemesterRegistrationController.insertDB)

router.put('/:id',
validateRequest(SemesterRegistrationValidation.update),
SemesterRegistrationController.updateOneToDB)


//! registration ///

router.post('/start-registration',auth(ENUM_USER_ROLE.STUDENT),SemesterRegistrationController.startRegistration)


router.post('/enroll-into-course',
auth(ENUM_USER_ROLE.STUDENT),
validateRequest(SemesterRegistrationValidation.enrollOrWithdrawCourse),
SemesterRegistrationController.enrollToCourse)

router.post('/withdraw-from-course',
auth(ENUM_USER_ROLE.STUDENT),
validateRequest(SemesterRegistrationValidation.enrollOrWithdrawCourse),
SemesterRegistrationController.withdrawFromCourse)

router.post('/confirm-my-registration',
auth(ENUM_USER_ROLE.STUDENT),
// validateRequest(SemesterRegistrationValidation.enrollOrWithdrawCourse),
SemesterRegistrationController.confirmMyRegistration)

             


export const semesterRegistrationRoutes = router;
