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

router
  .route('/')
  .get(
    protectedRoute,
    restrictTo('user', 'teacher', 'mod', 'admin'),
    getAllClasses,
  )
  .post(protectedRoute, restrictTo('teacher', 'mod', 'admin'), createClass);

router
  .route('/:id')
  .get(protectedRoute, restrictTo('user', 'teacher', 'mod', 'admin'), getClass)
  .delete(protectedRoute, restrictTo('teacher', 'mod', 'admin'), deleteClass)
  .patch(protectedRoute, restrictTo('teacher', 'mod', 'admin'), updateClass);

export default router;
