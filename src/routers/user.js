const express = require('express');
const mongoose = require('mongoose');
const router = new express.Router();
const User = require('../models/user');

// Adding a new user
router.post('/users', async (req, res) => {
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

// Get all users
router.get('/users', async (req, res) => {
  try {
    // The result of the .find method is being stored
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send();
  }
});

// Get a single user using an id
router.get('/users/:id', async (req, res) => {
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

// Update a user using an id
router.patch('/users/:id', async (req, res) => {
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
    // Manually find the user then save so that the 'pre' middleware
    //    in the schema will run
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('No user found');
    }

    updateKeys.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Delete a user using an id
router.delete('/users/:id', async (req, res) => {
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

// Log a user in
router.post('/users/login', async (req, res) => {
  try {
    // This is a custom method added to the schema which can be found
    //    in the schema file
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

module.exports = router;
