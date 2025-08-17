import mongoose from 'mongoose';
import validator from 'validator';
import argon2 from 'argon2';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Bitte Vornamen angeben'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Bitte Nachnamen angeben'],
      trim: true,
    },
    age: {
      type: Number,
      required: function () {
        // 'this' ist das aktuelle Dokument
        return this.role === 'user';
      },
    },
    className: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'teacher', 'mod', 'admin'],
      default: 'teacher',
    },
    email: {
      type: String,
      required: [true, 'Bitte E-mail angeben'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Ungültige E-Mail Adresse'],
    },
    password: {
      type: String,
      required: [true, 'Passwort ist erforderlich'],
      validate: [
        (password) =>
          validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        'Passwort ist nicht stark genug',
      ],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Bitte bestätige das Passwort'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  {
    timestamps: true, // erstellt automatisch createdAt & updatedAt
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await argon2.hash(this.password);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (password, hashedPassword) {
  return await argon2.verify(hashedPassword, password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // this zeigt auf das userSchema
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp; // the token was issued at time 100 and we changed the password at time 200, so we changed the password after the token was issued
  }
  // False means not changed
  return false;
};

const User = mongoose.model('User', userSchema);
export default User;
