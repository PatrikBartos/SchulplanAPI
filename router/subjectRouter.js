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

router.use(protectedRoute);

router
  .route('/')
  .post(restrictTo('mod', 'admin'), createSubject)
  .get(restrictTo('user', 'teacher', 'mod', 'admin'), getAllSubjects);
router
  .route('/:id')
  .get(restrictTo('user', 'teacher', 'mod', 'admin'), getSubject)
  .patch(restrictTo('mod', 'admin'), updateSubject)
  .delete(restrictTo('mod', 'admin'), deleteSubject);

export default router;
