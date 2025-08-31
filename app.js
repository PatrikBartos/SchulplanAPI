import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import scheduleRouter from './router/scheduleRouter.js';
import subjectRouter from './router/subjectRouter.js';
import userRouter from './router/userRouter.js';
import classRouter from './router/classRouter.js';
import errorHandlingMiddleware from './controller/errorController.js';
import AppError from './utils/appError.js';

const app = express();
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  message: {
    status: 'fail',
    message: 'Zu viele Anfragen. Bitte versuche es später erneut',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use('/api/v1/schedule', scheduleRouter);
app.use('/api/v1/subject', subjectRouter);
app.use('/api/v1/class', classRouter);

app.use('/api/v1/user', userRouter);

app.use((req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandlingMiddleware);

export default app;
