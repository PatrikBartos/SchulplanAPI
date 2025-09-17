import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

export const updateDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('Dokument wurde nicht gefunden', 400));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

export const getDoc = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let query = await Model.findById(id);

    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('Dokument nicht gefunden', 400));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

export const getAllDoc = (Model, popOptions, options = {}) =>
  catchAsync(async (req, res, next) => {
    let query = {};
    if (options.restrictToClass && req.user.role === 'user') {
      query = { className: req.user.className };
    }

    const features = await new APIFeatures(Model.find(query), req.query)
      .filter()
      .sort()
      .fieldLimiting()
      .pagination();

    if (popOptions) features.query = features.query.populate(popOptions);

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc,
      },
    });
  });

export const deleteDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(new AppError('Dokument nicht gefunden', 400));
    }

    res.status(204).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
