import mongoose from 'mongoose';

const subjectModel = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Bitte ein Fach angeben'],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Bitte Lehrer angeben'],
    },
    className: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
  },
  {
    timestamps: true, // erstellt automatisch createdAt & updatedAt
  },
);

subjectModel.index({ className: 1 });
subjectModel.index({ teacher: 1 });

const Subject = mongoose.model('Subject', subjectModel);
export default Subject;
