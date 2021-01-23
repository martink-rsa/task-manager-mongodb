const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true, // Field has to be included by using required
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false, // Setting a default value
  },
});

taskSchema.pre('save', async function (next) {
  const task = this;

  console.log('Trigger before saving task');

  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
