import express from 'express';
import { academicRouter } from '../modules/academicSemester/academicSemester.router';
import { studentsRoutes } from '../modules/Students/Students.route';
import { academicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.routes';
import { academicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.routes';

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
    path:'/academic-department',
    routes:academicDepartmentRoutes
  },
  {
    path:'/academic-faculty',
    routes:academicFacultyRoutes
  },
];

moduleRoutes.forEach(route => router.use(route.path, route?.routes));
export default router;
