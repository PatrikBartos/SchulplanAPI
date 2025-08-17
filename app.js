import express from 'express';
import scheduleRouter from './router/scheduleRouter.js';
import subjectRouter from './router/subjectRouter.js';
import userRouter from './router/userRouter.js';
import classRouter from './router/classRouter.js';
import errorHandlingMiddleware from './controller/errorController.js';
import AppError from './utils/appError.js';

const app = express();
app.use(express.json());

app.use('/api/v1/schedule', scheduleRouter);
app.use('/api/v1/subject', subjectRouter);
app.use('/api/v1/class', classRouter);

app.use('/api/v1/user', userRouter);

app.use((req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandlingMiddleware);

export default app;
