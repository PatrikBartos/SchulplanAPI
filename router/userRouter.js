import express from 'express';
import {
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  getUsersFromClass,
  deleteMe,
  updateMe,
} from '../controller/userController.js';
import {
  // signupUser,
  // signupTeacher,
  signup,
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

router.post('/signup-user', signup('user'));
router.post('/signup-teacher', signup('teacher'));
router.post(
  '/signup-admin',
  protectedRoute,
  restrictTo('admin'),
  signup('admin'),
);
router.post('/signup-mod', protectedRoute, restrictTo('admin'), signup('mod'));

router.post('/login', login);
router.patch('/deleteMe', protectedRoute, deleteMe);
router.patch('/updateMe', protectedRoute, updateMe);

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
