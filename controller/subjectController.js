import Subject from '../models/subject.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

export const createSubject = catchAsync(async (req, res, next) => {
  const { subject, teacher, className } = req.body;

  if (!subject || !teacher || !className) {
    return next(new AppError('Bitte alle Felder ausfüllen', 400));
  }

  const newSubject = new Subject({ subject, teacher, className });
  await newSubject.save();

  res.status(200).json({
    status: 'success',
    data: {
      newSubject,
    },
  });
});

export const getAllSubject = catchAsync(async (req, res, next) => {
  const data = await new APIFeatures(
    Subject.find().populate([
      { path: 'teacher', select: 'firstName' },
      {
        path: 'className',
        select: 'name',
      },
    ]),
    req.query,
  )
    .filter()
    .sort()
    .fieldLimiting()
    .pagination();

  const subjects = await data.exec();

  res.status(200).json({
    status: 'success',
    data: {
      subjects,
    },
  });
});

export const getSubject = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Ungültige ID', 404));
  }

  const subject = await Subject.findById(id).populate({
    path: 'teacher',
    select: 'firstName lastName',
  });

  res.status(200).json({
    status: 'success',
    data: {
      subject,
    },
  });
});

export const updateSubject = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Ungültige ID', 404));
  }

  const updatedSubject = await Subject.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedSubject,
    },
  });
});

export const deleteSubject = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Ungültige ID', 404));
  }

  const deletedSubject = await Subject.findByIdAndDelete(id);

  res.status(204).json({
    status: 'success',
    data: {
      deletedSubject,
    },
  });
});
