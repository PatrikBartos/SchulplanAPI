import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const updateDoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      return next(new AppError('Ungültige ID', 404));
    }

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
