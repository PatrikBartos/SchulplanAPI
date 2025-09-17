import User from '../models/user.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';
import {
  updateDoc,
  deleteDoc,
  getDoc,
  getAllDoc,
} from './factoryController.js';
import { restrictTo } from './authController.js';

const filterObj = (obj, ...allowedFields) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => allowedFields.includes(key)),
  );

export const getAllUser = getAllDoc(
  User,
  {
    path: 'className',
    select: 'name',
  },
  { restrictToClass: null },
);

export const getUser = getDoc(User);

export const updateUser = updateDoc(User);

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.user.isActive === false) {
    return next(
      new AppError('Gelöschte Accounts können nicht aktualisiert werden', 403),
    );
  }

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'Diese Route ist nicht für das ändern des Passworts. Bitte benutze /updatePassword ',
        400,
      ),
    );
  }

  const filteredBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'age',
    'email',
  );
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

export const deleteUser = deleteDoc(User);

export const deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new AppError('Benuter nicht gefunden', 400));
  }

  const { password } = req.body;
  if (!password) {
    return next(new AppError('Bitte Passwort angeben', 400));
  }

  const isCorrect = await user.correctPassword(password, user.password);
  if (!isCorrect) {
    return next(new AppError('Falsches Passwort', 401));
  }

  await User.findByIdAndUpdate(
    req.user.id,
    {
      isActive: false,
      deletedAt: Date.now(),
    },
    { validateBeforeSave: false },
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getUsersFromClass = async (req, res, next) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'classes',
          localField: 'className',
          foreignField: '_id',
          as: 'classInfo',
        },
      },
      { $unwind: '$classInfo' },
      {
        $match: {
          'classInfo.name': { $regex: `^${req.params.grade}` },
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          'classInfo.name': 1,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};
