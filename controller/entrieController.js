import Entrie from '../models/entrie.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import {
  updateDoc,
  getAllDoc,
  getDoc,
  deleteDoc,
} from './factoryController.js';

export const createEntrie = catchAsync(async (req, res, next) => {
  const { entrie, className } = req.body;

  let { schedule } = req.body;
  if (!schedule) schedule = req.params.scheduleId;

  const newEntrie = new Entrie({ entrie, schedule, className });
  await newEntrie.save();

  res.status(201).json({
    status: 'success',
    data: {
      newEntrie,
    },
  });
});

export const getAllEntries = getAllDoc(
  Entrie,
  [
    {
      path: 'schedule',
      select: 'day subject order',
      populate: {
        path: 'subject',
        select: 'subject',
      },
    },
    { path: 'className', select: 'name' },
  ],
  { restrictToClass: true },
);

export const getEntrie = getDoc(
  Entrie,
  [
    {
      path: 'schedule',
      select: 'day subject order',
      populate: {
        path: 'subject',
        select: 'subject',
      },
    },
    { path: 'className', select: 'name' },
  ],
  { restrictToClass: true },
);

export const updateEntrie = updateDoc(Entrie);

export const deleteEntrie = deleteDoc(Entrie);
