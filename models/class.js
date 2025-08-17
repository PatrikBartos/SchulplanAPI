import mongoose from 'mongoose';

const classModel = new mongoose.Schema({
  name: { type: String, required: true },
});

const Class = mongoose.model('Class', classModel);
export default Class;
