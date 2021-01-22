const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
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

module.exports = Task;
