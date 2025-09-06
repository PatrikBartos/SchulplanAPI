import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import scheduleRouter from './router/scheduleRouter.js';
import subjectRouter from './router/subjectRouter.js';
import userRouter from './router/userRouter.js';
import classRouter from './router/classRouter.js';
import entrieRouter from './router/entrieRouter.js';
import errorHandlingMiddleware from './controller/errorController.js';
import AppError from './utils/appError.js';
import mongoSanitize from 'express-mongo-sanitize';
import sanitizeHTML from './utils/sanitize.js';
import hpp from 'hpp';

const app = express();
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(hpp());

app.use((req, _res, next) => {
  if (req.body) {
    mongoSanitize.sanitize(req.body); // nur req.body wird bereinigt
  }
  next();
});

app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHTML(req.body[key]);
      }
    });
  }
  next();
});
// Object.keys(req.body) z.b bei { "name": "Alice", "comment": "<script>alert(1)</script>" } === ["name", "comment"]
// req.body[key] → Zugriff auf den Wert dieses Feldes dynamisch
// key = Name des Feldes
// obj[key] = Wert des Feldes

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
app.use('/api/v1/entrie', entrieRouter);

app.use('/api/v1/user', userRouter);

app.use((req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandlingMiddleware);

export default app;
