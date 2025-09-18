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

router.use(protectedRoute);

router
  .route('/')
  .get(restrictTo('user', 'teacher', 'mod', 'admin'), getAllSchedule)
  .post(restrictTo('mod', 'admin'), createSchedule);

router
  .route('/:id')
  .get(restrictTo('user', 'teacher', 'mod', 'admin'), getSchedule)
  .delete(restrictTo('mod', 'admin'), deleteSchedule)
  .patch(restrictTo('mod', 'admin'), updateSchedule);

export default router;
