import Class from '../models/class.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';
import { updateDoc } from '../controller/factoryController.js';

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

export const getAllClasses = catchAsync(async (req, res, next) => {
  const data = await new APIFeatures(Class.find(), req.query)
    .filter()
    .sort()
    .fieldLimiting()
    .pagination();

  const classes = await data.exec();

  res.status(200).json({
    status: 'success',
    data: {
      classes,
    },
  });
});

export const getClass = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Ungültige ID', 404));
  }

  const schoolClass = await Class.findById(id);

  if (!schoolClass) {
    return next(new AppError('Klasse nicht gefunden', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      schoolClass,
    },
  });
});

export const updateClass = updateDoc(Class);

export const deleteClass = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Ungültige ID', 404));
  }

  const deletedClass = await Class.findByIdAndDelete(id);

  if (!deletedClass) {
    return next(new AppError('Klasse nicht gefunden', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
