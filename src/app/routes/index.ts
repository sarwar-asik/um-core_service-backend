import express from 'express';
import { academicRouter } from '../modules/academicSemester/academicSemester.router';
import { studentsRoutes } from '../modules/Students/Students.route';
import { academicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.routes';
import { academicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.routes';
import { buildingsRoutes } from '../modules/buildings/buildings.route';
import { roomsRoutes } from '../modules/rooms/rooms.route';
import { coursesRoutes } from '../modules/courses/courses.route';
import { facultyRoutes } from '../modules/faculty/faculty.routes';
import { semesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semester',
    routes: academicRouter,
  },
  {
    path:'/students',
    routes:studentsRoutes
  },
  {
    path:'/academic-faculty',
    routes:academicFacultyRoutes
  },
  {
    path:'/academic-department',
    routes:academicDepartmentRoutes
  },
  {
    path:'/buildings',
    routes:buildingsRoutes
  },
  {
    path:'/rooms',
    routes:roomsRoutes
  },
  {
    path:'/courses',
    routes:coursesRoutes
  },
  {
    path:'/faculty',
    routes:facultyRoutes
  },
  {
    path:'/semester-registration',
    routes:semesterRegistrationRoutes
  },
];

moduleRoutes.forEach(route => router.use(route.path, route?.routes));
export default router;
