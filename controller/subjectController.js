import Subject from '../models/subject.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';
import {
  updateDoc,
  getDoc,
  getAllDoc,
  deleteDoc,
} from './factoryController.js';

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

export const getAllSubjects = getAllDoc(
  Subject,
  [
    { path: 'teacher', select: 'firstName lastName' },
    { path: 'className', select: 'name' },
  ],
  { restrictToClass: true },
);

export const getSubject = getDoc(
  Subject,
  [
    { path: 'teacher', select: 'firstName' },
    { path: 'className', select: 'name' },
  ],
  { restrictToClass: true },
);

export const updateSubject = updateDoc(Subject);

export const deleteSubject = deleteDoc(Subject);
