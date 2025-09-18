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

router.post('/forgotPassword', forgotPasswordLimiter, forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.post('/signup-user', signup('user'));
router.post('/signup-teacher', signup('teacher'));

router.post('/login', login);

router.use(protectedRoute);

router.patch(
  '/updatePassword',

  restrictTo('user', 'teacher', 'mod', 'admin'),
  updatePassword,
);

router.get('/class/:grade', getUsersFromClass);

router.post(
  '/signup-admin',

  restrictTo('admin'),
  signup('admin'),
);
router.post('/signup-mod', restrictTo('admin'), signup('mod'));

router.patch('/deleteMe', deleteMe);
router.patch('/updateMe', updateMe);

router
  .route('/')
  .get(restrictTo('user', 'teacher', 'mod', 'admin'), getAllUser);
router
  .route('/:id')
  .get(restrictTo('user', 'teacher', 'mod', 'admin'), getUser)
  .patch(restrictTo('mod', 'admin'), updateUser)
  .delete(restrictTo('mod', 'admin'), deleteUser);

export default router;
