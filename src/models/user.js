const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const log = require('../utils/log');

const userSchema = new mongoose.Schema({
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
    // Important note regarding the unique field:
    // The table has to be dropped before making this will take effect.
    // 1. Kill this node server (npm run dev)
    // 2. Drop the table
    // 3. Restart Node server (npm run dev)
    // This does not work well with production.
    // Alternatively, one can run this in the MongoDB shell, however
    //    I have not tested it:
    // db.users.createIndex({"email" : 1}, { unique: true })
    // It is also suggested to use: db.<collection-name>.reIndex()
    //    However this did not work for me
    // https://stackoverflow.com/questions/5535610/mongoose-unique-index-not-working
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email address is not valid');
      }
    },
  },
});

// Creating a custom method in the schema that will check the
//    user credentials
userSchema.statics.findByCredentials = async (email, password) => {
  // Use a generic error message for logging in as you do not want
  //    to be giving specifics about what part of the call failed
  //    i.e. email is wrong or password is wrong
  const ERROR_MESSAGE = 'Unable to login';
  // First find the user
  const user = await User.findOne({ email: email });

  // If no user exists, then throw a generic error message.
  if (!user) {
    throw new Error(ERROR_MESSAGE);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error(ERROR_MESSAGE);
  }

  return user;
};

// You can run a function `pre` or `post`, before or after
//    an action is taken. For example, before the `save`
//    action takes place
// NOTE: Can't use an arrow function below due to the .this binding
//    which is needed to access the data from the API call
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  log.info('Triggered "save" middleware');

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
