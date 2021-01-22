const express = require('express');
const log = require('./utils/log');
const mongoose = require('mongoose');

// Load the Mongoose file which has the MongoDB connection
require('./db/mongoose');

const User = require('./models/user');
const Task = require('./models/task');
const { findByIdAndUpdate } = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/* --- USERS --- */

app.post('/users', async (req, res) => {
  const user = new User(req.body);
  // Using a try-catch block to handle success and failure
  try {
    // Await the saving of the document. Note how no variable is being used.
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users', async (req, res) => {
  try {
    // The result of the .find method is being stored
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send();
  }
});

app.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  // Need to check that the id will match the MongoDB id type
  //    otherwise an error will occur here if the id passed
  //    does not match a MongoDB ID
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).send({ error: 'ID is not of valid ID type' });
  }

  try {
    const user = await User.findById(_id);
    // No user exists
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.patch('/users/:id', async (req, res) => {
  const _id = req.params.id;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).send({ error: 'ID is not of valid ID type' });
  }

  // This check ensures that all the keys being passed are part of the accepted keys
  const updateKeys = Object.keys(req.body);
  const allowedKeys = ['name', 'email', 'password'];
  const isValidOperation = updateKeys.every((update) =>
    allowedKeys.includes(update),
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update parameters' });
  }

  try {
    const user = await User.findByIdAndUpdate(_id, req.body, {
      new: true, // Ensures that the updated user is returned instead of the user before it was updated
      runValidators: true, // Ensures that validations are run on the new data that will be used in the update
    });
    if (!user) {
      return res.status(404).send('No user found');
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.delete('/users/:id', async (req, res) => {
  const _id = req.params.id;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).send({ error: 'ID is not of valid ID type' });
  }

  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ message: 'User deleted', user });
  } catch (e) {
    res.status(500).send(e);
  }
});

/* --- TASKS --- */

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    if (!tasks) {
      return res.status(200).send('No tasks found');
    }
    res.status(200).send(tasks);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  // Need to check that the id will match the MongoDB id type
  //    otherwise an error will occur here if the id passed
  //    does not match a MongoDB ID
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).send({ error: 'ID is not of valid ID type' });
  }
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.patch('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).send({ error: 'ID is not of valid ID type' });
  }

  // This check ensures that all the keys being passed are part of the accepted keys
  const updateKeys = Object.keys(req.body);
  const allowedKeys = ['description', 'completed'];
  const isValidOperation = updateKeys.every((update) => {
    return allowedKeys.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update parameters' });
  }

  try {
    const task = await Task.findByIdAndUpdate(_id, req.body, {
      new: true, // Ensures that the updated user is returned instead of the user before it was updated
      runValidators: true, // Ensures that validations are run on the new data that will be used in the update
    });
    res.status(200).send(task);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).send({ error: 'ID is not of valid ID type' });
  }

  try {
    const task = await Task.findByIdAndDelete(_id);
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.listen(port, () => {
  log.info('Server is up on port:', port);
});
