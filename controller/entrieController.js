import Entrie from '../models/entrie.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const createEntrie = catchAsync(async (req, res, next) => {
  const { entrie } = req.body;

  let { schedule } = req.body;
  if (!schedule) schedule = req.params.scheduleId;

  const newEntrie = new Entrie({ entrie, schedule });
  await newEntrie.save();

  res.status(201).json({
    status: 'success',
    data: {
      newEntrie,
    },
  });
});

export const getAllEntries = catchAsync(async (req, res, next) => {
  const entries = await Entrie.find().populate({
    path: 'schedule',
    select: 'day subject order',
    populate: {
      path: 'subject',
      select: 'subject',
    },
  });

  res.status(200).json({
    status: 'success',
    results: entries.length,
    data: {
      entries,
    },
  });
});
