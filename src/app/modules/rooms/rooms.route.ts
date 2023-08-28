
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { RoomsController } from './rooms.controller';
import { RoomsValidation } from './rooms.validation';
const router = Router();
router.get('/',RoomsController.getAllDb);
router.post(
  '/',
  // auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.FACULTY,ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(RoomsValidation.createRooms),
  RoomsController.insertDB
);

router.get('/:id',RoomsController.getSingleDataById)

router.put('/:id',RoomsController.updateIntoDb)
router.delete('/:id',RoomsController.updateIntoDb)

export const roomsRoutes = router;
