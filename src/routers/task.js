const express = require('express');
const mongoose = require('mongoose');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /tasks?completed=true
router.get('/tasks', auth, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    // 'completed' is not a boolean even though it's coming back as true
    //  or false; it's still a string. We can check if it has the string 'true'
    //  then pass back boolean true, otherwise pass back false.
    match.completed = req.query.completed === 'true';
  }
  try {
    await req.user
      .populate({
        path: 'tasks',
        match,
      })
      .execPopulate();

    if (!req.user.tasks) {
      return res.status(200).send('No tasks found');
    }
    res.status(200).send(req.user.tasks);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).send({ error: 'ID is not of valid ID type' });
  }

  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
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
    const task = await Task.findOne({ _id, owner: req.user, _id });
    if (!task) {
      return res.status(404).send();
    }
    updateKeys.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.status(200).send(task);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).send({ error: 'ID is not of valid ID type' });
  }

  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
