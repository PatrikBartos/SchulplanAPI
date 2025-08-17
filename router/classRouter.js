import express from 'express';
import {
  getClass,
  getAllClasses,
  updateClass,
  deleteClass,
  createClass,
} from '../controller/classController.js';

import { protectedRoute } from '../controller/authController.js';

const router = express.Router();

router
  .route('/')
  .get(protectedRoute, getAllClasses)
  .post(protectedRoute, createClass);

router
  .route('/:id')
  .get(protectedRoute, getClass)
  .delete(protectedRoute, deleteClass)
  .patch(protectedRoute, updateClass);

export default router;
