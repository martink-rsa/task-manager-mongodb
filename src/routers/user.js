const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const sharp = require('sharp');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const {
  sendWelcomeEmail,
  sendCancellationEmail,
} = require('../emails/account');

// Adding a new user
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  // Using a try-catch block to handle success and failure
  try {
    // Await the saving of the document. Note how no variable is being used.
    await user.save();
    const token = await user.generateAuthToken();
    sendWelcomeEmail(user.email, user.name);
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
    allowedKeys.includes(update)
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
    sendCancellationEmail(req.user.email, req.user.name);
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
      req.body.password
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
  },
});

router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    // Resizing the image using sharp
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send({ message: 'Image uploaded' });
  },
  //  This error handler is used to send a clean error message which would
  //  otherwise be an HTML file
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete('/users/me/avatar', auth, async (req, res) => {
  if (!req.user.avatar) {
    return res.status(404).send({ message: 'No avatar image to delete' });
  }
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send({ message: 'Avatar deleted' });
  } catch (e) {
    res.status(500).send('Error');
  }
});

router.get('/users/:id/avatar', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.status(200).send(user.avatar);
  } catch (e) {
    res.status(500).send('Error getting user avatar');
  }
});

module.exports = router;
