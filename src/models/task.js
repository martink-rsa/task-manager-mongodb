const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true, // Field has to be included by using required
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false, // Setting a default value
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // This creates a reference to the User object,
      // which can then be populated with populate('owner').execPopulate()
      ref: 'User',
    },
  },
  // Options below
  // Timestamps will show timestamps of each of the tasks
  // createdAt and updatedAt
  { timestamps: true },
);

taskSchema.pre('save', async function (next) {
  const task = this;

  console.log('Trigger before saving task');

  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
