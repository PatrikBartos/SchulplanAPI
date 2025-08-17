import express from 'express';
import {
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controller/userController.js';
import {
  signupUser,
  signupTeacher,
  login,
  protectedRoute,
  restrictTo,
} from '../controller/authController.js';

const router = express.Router();

router.post('/signup-user', signupUser);
router.post('/signup-teacher', signupTeacher);
router.post('/login', login);

router
  .route('/')
  .get(
    protectedRoute,
    restrictTo('user', 'teacher', 'mod', 'admin'),
    getAllUser,
  );
router
  .route('/:id')
  .get(protectedRoute, restrictTo('user', 'teacher', 'mod', 'admin'), getUser)
  .patch(protectedRoute, restrictTo('mod', 'admin'), updateUser)
  .delete(protectedRoute, restrictTo('mod', 'admin'), deleteUser);

export default router;
