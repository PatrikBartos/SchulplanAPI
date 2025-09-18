import express from 'express';
import {
  getClass,
  getAllClasses,
  updateClass,
  deleteClass,
  createClass,
} from '../controller/classController.js';

import { protectedRoute, restrictTo } from '../controller/authController.js';

const router = express.Router();

router.use(protectedRoute);

router
  .route('/')
  .get(restrictTo('user', 'teacher', 'mod', 'admin'), getAllClasses)
  .post(restrictTo('teacher', 'mod', 'admin'), createClass);

router
  .route('/:id')
  .get(restrictTo('user', 'teacher', 'mod', 'admin'), getClass)
  .delete(restrictTo('teacher', 'mod', 'admin'), deleteClass)
  .patch(restrictTo('teacher', 'mod', 'admin'), updateClass);

export default router;
