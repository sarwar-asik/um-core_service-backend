
import express from "express"
import { StudentEnrollCourseMarkController } from "./studentEnrollCourseMark.controller"
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
const router = express.Router()

router.get('/',
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.FACULTY),
    StudentEnrollCourseMarkController.getAllFromDB
);

router.patch('/update-marks',StudentEnrollCourseMarkController.updateStudentMarks)
router.patch('/final-marks',StudentEnrollCourseMarkController.updateFinalMarks)

export const studentEnrollCourseMarkRouter = router