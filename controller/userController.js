import User from '../models/user.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getAllUser = catchAsync(async (req, res, next) => {
  const data = await new APIFeatures(
    User.find().populate({
      path: 'className',
      select: 'name',
    }),
    req.query,
  )
    .filter()
    .sort()
    .fieldLimiting()
    .pagination();

  const users = await data.exec();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Ungültige ID', 404));
  }

  const user = await User.findById(id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Ungültige ID', 404));
  }

  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
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

export const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Ungültige ID', 404));
  }

  const deletedUser = await User.findByIdAndDelete(id);

  res.status(204).json({
    status: 'success',
    data: {
      deletedUser,
    },
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
