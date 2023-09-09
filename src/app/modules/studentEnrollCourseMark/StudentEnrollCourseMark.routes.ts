
import express from "express"
import { StudentEnrollCourseMarkController } from "./studentEnrollCourseMark.controller"
const router = express.Router()

router.patch('/update-marks',StudentEnrollCourseMarkController.updateStudentMarks)

export const studentEnrollCourseMarkRouter = router