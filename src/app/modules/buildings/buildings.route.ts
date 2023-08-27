/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingsController } from './buildings.controller';
import { BuildingsValidation } from './buildings.validation';
const router = Router();
router.get('/');
router.post(
  '/',
  validateRequest(BuildingsValidation.createBuildings),
  BuildingsController.insertDB
);

export const buildingsRoutes = router;
