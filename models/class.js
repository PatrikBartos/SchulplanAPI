import mongoose from 'mongoose';

const classModel = new mongoose.Schema({
  name: { type: String, required: true },
});

classModel.index({ name: 1 }, { unique: true });

const Class = mongoose.model('Class', classModel);
export default Class;
