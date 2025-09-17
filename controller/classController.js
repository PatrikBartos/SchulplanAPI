import Class from '../models/class.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';
import {
  updateDoc,
  getDoc,
  deleteDoc,
  getAllDoc,
} from '../controller/factoryController.js';

export const createClass = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError('Bitte den Klassennamen angeben', 400));
  }

  const newClass = new Class({ name });
  await newClass.save();

  res.status(201).json({
    status: 'success',
    data: {
      newClass,
    },
  });
});

export const getAllClasses = getAllDoc(Class);

export const getClass = getDoc(Class);

export const updateClass = updateDoc(Class);

export const deleteClass = deleteDoc(Class);
