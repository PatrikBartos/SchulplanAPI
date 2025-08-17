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

export const getAllSubjects = catchAsync(async (req, res, next) => {
  const query =
    req.user.role === 'user' ? { className: req.user.className } : {}; // Lehrer/Admin sehen alles

  const data = await new APIFeatures(
    Subject.find(query).populate([
      { path: 'teacher', select: 'firstName lastName' },
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

  if (!subject) {
    return next(new AppError('Fach nicht gefunden', 404));
  }

  if (
    req.user.role === 'user' &&
    !subject.className.equals(req.user.className)
  ) {
    return next(new AppError('Zugriff verweigert', 403));
  }

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
