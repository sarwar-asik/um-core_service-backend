/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingsController } from './buildings.controller';
import { BuildingsValidation } from './buildings.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = Router();
router.get('/',BuildingsController.getAllDb);
router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.FACULTY,ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(BuildingsValidation.createBuildings),
  BuildingsController.insertDB
);

router.get('/:id',BuildingsController.getSingleDataById)

router.put('/:id',BuildingsController.updateIntoDb)
router.delete('/:id',BuildingsController.updateIntoDb)

export const buildingsRoutes = router;
