/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingsController } from './buildings.controller';
import { BuildingsValidation } from './buildings.validation';
const router = Router();
router.get('/',BuildingsController.getAllDb);
router.post(
  '/',
  validateRequest(BuildingsValidation.createBuildings),
  BuildingsController.insertDB
);

router.get('/:id',BuildingsController.getSingleDataById)

router.put('/id',BuildingsController.updateIntoDb)
router.delete('/id',BuildingsController.updateIntoDb)

export const buildingsRoutes = router;
