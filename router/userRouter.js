import express from 'express';
import {
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  getUsersFromClass,
} from '../controller/userController.js';
import {
  signupUser,
  signupTeacher,
  login,
  protectedRoute,
  restrictTo,
  forgotPassword,
  resetPassword,
  forgotPasswordLimiter,
  updatePassword,
} from '../controller/authController.js';

const router = express.Router();

router.patch(
  '/updatePassword',
  protectedRoute,
  restrictTo('user', 'teacher', 'mod', 'admin'),
  updatePassword,
);

router.post('/forgotPassword', forgotPasswordLimiter, forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.get('/class/:grade', getUsersFromClass);

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
