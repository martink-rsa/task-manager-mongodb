const express = require('express');
const router = new express.Router();
const User = require('../models/user');

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

router.get('/users', async (req, res) => {
  try {
    // The result of the .find method is being stored
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send();
  }
});

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

module.exports = router;
