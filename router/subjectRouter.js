import express from 'express';
import {
  createSubject,
  getAllSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} from '../controller/subjectController.js';

import { protectedRoute, restrictTo } from '../controller/authController.js';

const router = express.Router();

router
  .route('/')
  .post(protectedRoute, restrictTo('teacher', 'mod', 'admin'), createSubject)
  .get(
    protectedRoute,
    restrictTo('user', 'teacher', 'mod', 'admin'),
    getAllSubjects,
  );
router
  .route('/:id')
  .get(
    protectedRoute,
    restrictTo('user', 'teacher', 'mod', 'admin'),
    getSubject,
  )
  .patch(protectedRoute, restrictTo('teacher', 'mod', 'admin'), updateSubject)
  .delete(protectedRoute, restrictTo('teacher', 'mod', 'admin'), deleteSubject);

export default router;
