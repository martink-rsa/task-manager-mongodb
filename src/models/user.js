const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const log = require('../utils/log');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');

const userSchema = new mongoose.Schema(
  {
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

    // Storing all of a user's tokens so that they can be logged in on different
    //    devices at the same time, and log out of one device while still being
    //    logged in on the others
    tokens: [
      {
        token: {
          type: String,
          require: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  // Options below
  // Timestamps will show timestamps of each of the users
  // createdAt and updatedAt
  { timestamps: true }
);

userSchema.virtual('tasks', {
  ref: 'Task',
  // What field is referenced when used by the other 'object'
  // This is like the foreign key
  localField: '_id',
  // This is the field on the referenced 'object', e.g. Task
  // This is like what the foreign key is called
  foreignField: 'owner',
});

// Database logic should be encapsulated within the data model.
// Mongoose provides 2 ways of doing this, methods and statics.
// Methods adds an instance method to documents whereas Statics
// adds static "class" methods to the Models itself.
// https://stackoverflow.com/questions/39708841/what-is-the-use-of-mongoose-methods-and-statics/52202920
// i.e. use method on individual documents if you want to manipulate
// the individual document like adding tokens.
// Use statics approach if you want to query the whole collection
// Generate a jwt token and add it to the user's list of tokens
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.TOKEN_SECRET
  );

  user.tokens = user.tokens.concat({ token: token });

  await user.save();

  return token;
};

// This method, which was getPublicProfile, has been changed
// to toJSON, which is called whenever the data is turned into
// JSON data. This is automatically happening in the app as
// we are sending back data as JSON
userSchema.methods.toJSON = function () {
  const user = this;

  // Create a user object so we can manipulate the data,
  // such as removing the password field
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};
/* userSchema.methods.getPublicProfile = function () {
  const user = this;

  // Create a user object so we can manipulate the data,
  // such as removing the password field
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}; */

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

  next();
});

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
