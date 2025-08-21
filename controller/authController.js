import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/user.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import sendEmail from '../utils/email.js';

dotenv.config();

const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const publicKeyPath = process.env.PUBLIC_KEY_PATH;

let privateKey;
let publicKey;

try {
  privateKey = fs.readFileSync(path.resolve(privateKeyPath), 'utf-8');
  publicKey = fs.readFileSync(path.resolve(publicKeyPath), 'utf-8');
} catch (err) {
  console.error('JWT Key konnte nicht geladen werden', err);
  process.exit(1);
}

export const signupTeacher = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    age,
    className,
    email,
    password,
    passwordConfirm,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !className ||
    !email ||
    !password ||
    !passwordConfirm
  ) {
    return next(new AppError('Bitte alle Felder ausfüllen', 400));
  }

  const newTeacher = new User({
    firstName,
    lastName,
    age,
    className,
    role: 'teacher',
    email,
    password,
    passwordConfirm,
  });
  await newTeacher.save();

  const payload = {
    id: newTeacher._id,
    email: newTeacher.email,
    role: newTeacher.role,
  };

  const token = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  newTeacher.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    data: {
      newTeacher,
    },
  });
});

export const signupUser = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    age,
    className,
    email,
    password,
    passwordConfirm,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !age ||
    !className ||
    !email ||
    !password ||
    !passwordConfirm
  ) {
    return next(new AppError('Bitte alle Felder ausfüllen!'));
  }

  const newUser = new User({
    firstName,
    lastName,
    age,
    className,
    role: 'user',
    email,
    password,
    passwordConfirm,
  });
  await newUser.save();

  const payload = { id: newUser._id, email: newUser.email, role: newUser.role };

  const token = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    data: {
      newUser,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Bitte alle Felder ausfüllen', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Falsche Email oder Password', 401));
  }

  const payload = { id: user._id, email: user.email, role: user.role };

  const token = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
});

export const protectedRoute = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(new AppError('Token fehlt', 401));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AppError('Token fehlt', 401));
  }

  const decoded = jwt.verify(token, publicKey, {
    algorithms: 'RS256',
  });

  req.user = decoded;

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('Benutzer existiert nicht', 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    // if this is true, the we want to this error happen
    return next(
      new AppError(
        'Benutzer Passwort kürzlich geändert. Bitte melden Sie sich erneut an. ',
        401,
      ),
    );
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Du hast keine Berechtigung dies zu tun!', 403));
    }

    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError('Kein Benutzer mit der Email Adresse gefunden!', 404),
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;

  const message = `Passwort vergessen? Sende eine PATCH-Anfrage mit deinem neuen Passwort und der Passwortbestätigung an: ${resetURL}.\nFalls du dein Passwort nicht vergessen hast, kannst du diese E-Mail ignorieren!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Dein Passwort reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token ist ungültig oder abgelaufen', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); // in der Datenbank speichern

  const payload = { id: user._id, email: user.email, role: user.role };

  const token = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '1h',
  });

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});
