const express = require('express');
const mongoose = require('mongoose');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');

// Adding a new user
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  // Using a try-catch block to handle success and failure
  try {
    // Await the saving of the document. Note how no variable is being used.
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Gets a user's profile
router.get('/users/me', auth, async (req, res) => {
  res.status(200).send(req.user);
});

// Update a user using an id
router.patch('/users/me', auth, async (req, res) => {
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
    updateKeys.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.status(200).send({ message: 'Updated user', user: req.user });
  } catch (e) {
    res.status(500).send(e);
  }
});

// Delete a user: Allow a user to delete their profile
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send({ message: 'User deleted' });
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
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    // Token is added to req in the auth middleware
    // Filter through the user's tokens and return all
    //    tokens that do not match the token in req
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    // Save the user so that the array of tokens is updated
    await req.user.save();
    res.status(200).send({ message: 'Logged out' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send({ message: 'Logged out of all devices' });
    //
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.post('/users/signup', async (req, res) => {
  // User enters details (name, password, email)

  try {
    const user = new User(req.body);
    user.save();
    const token = user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(500).send('Error');
  }
});

const upload = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000, // 1mb
  },
  fileFilter(req, file, cb) {
    // if (!file.originalname.match(/\.(doc|docx)$/)) {
    // Need to consider tiff, svg, webp and gif
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image file'));
    }
    cb(undefined, true);
    /* cb(new Error('File must be a PDF'));
    cb(undefined, true)
    cb(undefined, false) */
    console.log(file);
  },
});

router.post('/users/me/avatar', upload.single('avatar'), async (req, res) => {
  try {
    //
    res.status(201).send({ message: 'Image uploaded' });
  } catch (e) {
    res.status(500).send('Error');
  }
});

module.exports = router;
