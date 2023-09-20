import express from 'express';
import { studentEnrolledCourseRoutes } from '../modules/StudentEnrolledCourse/StudentEnrolledCourse.routes';
import { studentsRoutes } from '../modules/Students/Students.route';
import { academicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.routes';
import { academicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.routes';
import { academicRouter } from '../modules/academicSemester/academicSemester.router';
import { buildingsRoutes } from '../modules/buildings/buildings.route';
import { coursesRoutes } from '../modules/courses/courses.route';
import { facultyRoutes } from '../modules/faculty/faculty.routes';
import { offeredCourseRoutes } from '../modules/offeredCourse/offeredCourse.route';
import { offeredCourseClassSchedulesRoutes } from '../modules/offeredCourseClassSchedules/offeredCourseClassSchedules.route';
import { offeredCourseSectionRoutes } from '../modules/offeredCourseSection/offeredCourseSection.route';
import { roomsRoutes } from '../modules/rooms/rooms.route';
import { semesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.route';
import { studentEnrollCourseMarkRouter } from '../modules/studentEnrollCourseMark/StudentEnrollCourseMark.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semester',
    routes: academicRouter,
  },
  {
    path: '/students',
    routes: studentsRoutes,
  },
  {
    path: '/academic-faculty',
    routes: academicFacultyRoutes,
  },
  {
    path: '/academic-department',
    routes: academicDepartmentRoutes,
  },
  {
    path: '/buildings',
    routes: buildingsRoutes,
  },
  {
    path: '/rooms',
    routes: roomsRoutes,
  },
  {
    path: '/courses',
    routes: coursesRoutes,
  },
  {
    path: '/faculty',
    routes: facultyRoutes,
  },
  {
    path: '/semester-registration',
    routes: semesterRegistrationRoutes,
  },
  {
    path: '/offered-course',
    routes: offeredCourseRoutes,
  },
  {
    path: '/offered-course-section',
    routes: offeredCourseSectionRoutes,
  },
  {
    path: '/offered-course-class-schedules',
    routes: offeredCourseClassSchedulesRoutes,
  },
  {
    path: '/student-enrolled-courses',
    routes: studentEnrolledCourseRoutes,
  },
  {
    path: '/student-enroll-course-marks',
    routes: studentEnrollCourseMarkRouter,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route?.routes));
export default router;
