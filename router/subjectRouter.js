import express from 'express';
import {
  createSubject,
  getAllSubject,
  getSubject,
  updateSubject,
  deleteSubject,
} from '../controller/subjectController.js';

import { protectedRoute, restrictTo } from '../controller/authController.js';

const router = express.Router();

router
  .route('/')
  .post(protectedRoute, createSubject)
  .get(protectedRoute, getAllSubject);
router
  .route('/:id')
  .get(protectedRoute, getSubject)
  .patch(protectedRoute, updateSubject)
  .delete(protectedRoute, deleteSubject);

export default router;
