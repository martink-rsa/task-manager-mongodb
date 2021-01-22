const mongoose = require('mongoose');
const chalk = require('chalk');
const validator = require('validator');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager-api';

mongoose.connect(`${connectionURL}/${databaseName}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email address is not valid');
      }
    },
  },
});

const newUser = new User({
  name: 'Test Name   ',
  email: 'martin@asd.com',
  password: '1234567',
});

newUser
  .save()
  .then((user) => {
    console.log(user);
  })
  .catch((e) => {
    console.log(chalk.red.inverse('ERROR'), 'Unable to create user:');
    console.log(e);
  });

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
  // Example below for custom validation:
  // NOTE: Use a library like 'validator' if you ned complex validation
  /* itemCount: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error('Item count must be a positive number');
      }
    },
  }, */
  // Example below for 'validator' validate method
  /* email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    },
  }, */
});

// Create a new task using the model made above
const newTask = new Task({
  description: 'Clean dishes',
  completed: false,
});

// Save the task
newTask
  .save()
  .then((task) => {
    console.log(task);
  })
  .catch((e) => {
    console.log(chalk.red.inverse('ERROR'), 'Unable to create task:');
    console.log(e);
  });
