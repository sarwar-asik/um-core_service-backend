import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidation } from './academic.validation';
import { AcademicSemesterController } from './academicSemester.controller';
const router = express.Router();

router.post(
  '/',
  validateRequest(AcademicSemesterValidation.createAcademicSemester),
  AcademicSemesterController.insertDB
);

router.get('/', AcademicSemesterController.getAllDb);
router.get('/:id', AcademicSemesterController.getSingleDataById);

export const academicRouter = router;
