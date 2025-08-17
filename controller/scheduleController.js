import Schedule from '../models/schedule.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getAllSchedule = catchAsync(async (req, res, next) => {
  const query =
    req.user.role === 'user' ? { className: req.user.className } : {}; // Lehrer/Admin sehen alles

  const data = await new APIFeatures(
    Schedule.find(query).populate([
      { path: 'subject', select: 'subject' },
      { path: 'teacher', select: 'firstName lastName' },
      { path: 'className', select: 'name' },
    ]),
    req.query,
  )
    .filter()
    .sort()
    .fieldLimiting()
    .pagination();

  const schedules = await data.exec();

  res.status(200).json({
    status: 'success',
    results: schedules.length,
    data: { schedules },
  });
});

export const getSchedule = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Ungültige ID', 404));
  }

  const schedule = await Schedule.findById(id).populate([
    { path: 'subject', select: 'subject' },
    { path: 'teacher', select: 'firstName lastName' },
    { path: 'className', select: 'name' },
  ]);

  if (!schedule) {
    return next(new AppError('Stundenplan-Eintrag nicht gefunden', 404));
  }

  if (
    req.user.role === 'user' &&
    !schedule.className.equals(req.user.className)
  ) {
    return next(new AppError('Zugriff verweigert', 403));
  }

  res.status(200).json({
    status: 'success',
    data: { schedule },
  });
});

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

export const updateSchedule = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Ungültige ID', 404));
  }

  const updatedSchedule = await Schedule.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedSchedule,
    },
  });
});

export const deleteSchedule = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError('Ungültige ID', 404));
  }

  const deleteSchedule = await Schedule.findByIdAndDelete(id);

  res.status(204).json({
    status: 'success',
    data: {
      deleteSchedule,
    },
  });
});
