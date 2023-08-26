import express from 'express';
import { academicRouter } from '../modules/academicSemester/academicSemester.router';
import { studentsRoutes } from '../modules/Students/Students.route';

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
  }
];

moduleRoutes.forEach(route => router.use(route.path, route?.routes));
export default router;
