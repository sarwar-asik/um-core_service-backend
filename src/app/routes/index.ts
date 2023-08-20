import express from 'express';
import { academicRouter } from '../modules/academicSemester/academicSemester.router';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: "/academic-semester",
    routes: academicRouter
  }
];

moduleRoutes.forEach(route => router.use(route.path, route?.routes));
export default router;
