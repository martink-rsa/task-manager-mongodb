const express = require('express');
const router = new express.Router();
const Task = require('../models/task');

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/tasks', async (req, res) => {
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

router.get('/tasks/:id', async (req, res) => {
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

router.patch('/tasks/:id', async (req, res) => {
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

router.delete('/tasks/:id', async (req, res) => {
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

module.exports = router;
