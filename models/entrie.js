import mongoose, { mongo } from 'mongoose';

const entrieModel = new mongoose.Schema(
  {
    entrie: {
      type: String,
      required: false,
      maxLength: [250, 'Eintrag darf maximal 250 Zeichen lang sein'],
    },
    schedule: {
      type: mongoose.Schema.ObjectId,
      ref: 'Schedule',
      required: [true, 'Ein Eintrag muss einem Zeitplan angehören'],
    },
    className: {
      type: mongoose.Schema.ObjectId,
      ref: 'Class',
      required: [true, 'Bitte Klasse angeben'],
    },
  },
  {
    timestamps: true,
  },
);

const Entrie = mongoose.model('Entrie', entrieModel);
export default Entrie;
