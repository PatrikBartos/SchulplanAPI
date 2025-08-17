import dotenv from 'dotenv';
import User from '../models/user.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

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
