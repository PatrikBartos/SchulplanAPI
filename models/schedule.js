import mongoose from 'mongoose';

const scheduleModel = new mongoose.Schema(
  {
    order: {
      type: Number, // z. B. 1 = erste Stunde, 2 = zweite ...
      required: true,
      validate: {
        validator: Number.isInteger,
        message: (props) => `${props.value} ist keine gueltige Zahl`,
      },
    },
    day: {
      type: String,
      required: true,
      enum: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'],
    },
    startTime: {
      type: String,
      match: /^([01]\d|2[0-3]):[0-5]\d$/, // Regex für HH:mm
      required: true,
    },
    endTime: {
      type: String,
      match: /^([01]\d|2[0-3]):[0-5]\d$/, // Regex für HH:mm
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    className: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    room: {
      type: Number,
      required: false,
      validate: {
        validator: Number.isInteger,
        message: (props) => `${props.value} ist keine gueltige Zahl`,
      },
    },
  },
  {
    timestamps: true, // erstellt automatisch createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

scheduleModel.virtual('entrie', {
  ref: 'Entrie',
  foreignField: 'schedule',
  localField: '_id',
});

const Schedule = mongoose.model('Schedule', scheduleModel);

export default Schedule;
