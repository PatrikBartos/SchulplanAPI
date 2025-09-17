import Schedule from '../models/schedule.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';
import {
  updateDoc,
  getDoc,
  getAllDoc,
  deleteDoc,
} from './factoryController.js';

export const getAllSchedule = getAllDoc(
  Schedule,
  [
    { path: 'subject', select: 'subject' },
    { path: 'teacher', select: 'firstName lastName' },
    { path: 'className', select: 'name' },
  ],
  { restrictToClass: true },
);

export const getSchedule = getDoc(Schedule, [
  {
    path: 'entrie',
    select: '-className -createdAt -updatedAt',
  },
  { path: 'subject', select: 'subject' },
  { path: 'teacher', select: 'firstName lastName' },
  { path: 'className', select: 'name' },
]);

export const createSchedule = catchAsync(async (req, res, next) => {
  const { order, day, startTime, endTime, subject, teacher, className, room } =
    req.body;

  if (
    !order ||
    !day ||
    !startTime ||
    !endTime ||
    !subject ||
    !teacher ||
    !className ||
    !room
  ) {
    return next(new AppError('Bitte alle Felder ausfüllen', 400));
  }

  const newSchedule = new Schedule({
    order,
    day,
    startTime,
    endTime,
    subject,
    teacher,
    className,
    room,
  });
  await newSchedule.save();

  res.status(201).json({
    status: 'success',
    data: {
      newSchedule,
    },
  });
});

export const updateSchedule = updateDoc(Schedule);

export const deleteSchedule = deleteDoc(Schedule);
