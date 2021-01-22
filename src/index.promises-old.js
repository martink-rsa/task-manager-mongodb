const express = require('express');
const log = require('./utils/log');
const mongoose = require('mongoose');

// Load the Mongoose file which has the MongoDB connection
require('./db/mongoose');

const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/* --- USERS --- */

app.post('/users', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

app.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send();
    });
});

app.get('/users/:id', (req, res) => {
  const _id = req.params.id;

  // Need to check that the id will match the MongoDB id type
  //    otherwise an error will occur here if the id passed
  //    does not match a MongoDB ID
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).send({ error: 'ID is not of valid ID type' });
  }

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

/* --- TASKS --- */

app.post('/tasks', (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

app.get('/tasks', (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.status(200).send(tasks);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id;

  // Need to check that the id will match the MongoDB id type
  //    otherwise an error will occur here if the id passed
  //    does not match a MongoDB ID
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).send({ error: 'ID is not of valid ID type' });
  }

  Task.findById(_id)
    .then((task) => {
      if (!task) {
        return res.status(404).send({ message: 'No task found' });
      }
      res.status(200).send(task);
    })
    .catch((err) => res.status(400).send(err.message));
});

app.listen(port, () => {
  log.info('Server is up on port:', port);
});
