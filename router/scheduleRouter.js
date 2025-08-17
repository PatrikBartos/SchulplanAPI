import express from 'express';
import {
  getAllSchedule,
  getSchedule,
  deleteSchedule,
  updateSchedule,
  createSchedule,
} from '../controller/scheduleController.js';

import { protectedRoute } from '../controller/authController.js';

const router = express.Router();

router
  .route('/')
  .get(protectedRoute, getAllSchedule)
  .post(protectedRoute, createSchedule);

router
  .route('/:id')
  .get(protectedRoute, getSchedule)
  .delete(protectedRoute, deleteSchedule)
  .patch(protectedRoute, updateSchedule);

export default router;
