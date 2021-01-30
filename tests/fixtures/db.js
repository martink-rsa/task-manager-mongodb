const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Task = require('../../src/models/task');
const User = require('../../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: 'Test User 1',
  email: 'testUser1@testemail.com',
  password: '123password123!',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.TOKEN_SECRET),
    },
  ],
};
const userTwo = {
  _id: userTwoId,
  name: 'Test User 2',
  email: 'testUser2@testemail.com',
  password: '444password444!@@!',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.TOKEN_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task, user one',
  completed: false,
  owner: userOne._id,
};
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task, user one',
  completed: false,
  owner: userOne._id,
};
const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task, user two',
  completed: false,
  owner: userTwo._id,
};

const setupDatabase = async () => {
  await User.deleteMany(); // Delete all users before tests run
  await Task.deleteMany(); // Delete all tasks before tests run

  // Users
  await new User(userOne).save();
  await new User(userTwo).save();

  // Tasks
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
};
