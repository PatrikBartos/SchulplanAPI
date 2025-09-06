import express from 'express';
import {
  getAllSchedule,
  getSchedule,
  deleteSchedule,
  updateSchedule,
  createSchedule,
} from '../controller/scheduleController.js';

import { protectedRoute, restrictTo } from '../controller/authController.js';
import entrieRouter from './entrieRouter.js';

const router = express.Router();

router.use('/:scheduleId/entrie', entrieRouter);

router
  .route('/')
  .get(
    protectedRoute,
    restrictTo('user', 'teacher', 'mod', 'admin'),
    getAllSchedule,
  )
  .post(protectedRoute, restrictTo('teacher', 'mod', 'admin'), createSchedule);

router
  .route('/:id')
  .get(
    protectedRoute,
    restrictTo('user', 'teacher', 'mod', 'admin'),
    getSchedule,
  )
  .delete(protectedRoute, restrictTo('teacher', 'mod', 'admin'), deleteSchedule)
  .patch(protectedRoute, restrictTo('teacher', 'mod', 'admin'), updateSchedule);

export default router;
