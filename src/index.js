const express = require('express');
const log = require('./utils/log');
const dotenv = require('dotenv');
// Routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
// Middleware
const auth = require('./middleware/auth');

// Load the Mongoose file which has the MongoDB connection
require('./db/mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// app.use(auth);

app.use(express.json());

// Routers
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  log.info('Server is up on port:', port);
});

const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
  const userId = '600d4e782a9804946ff5f142';
  //
  /* const task = await Task.findById('600d57f660c59997064c5a91');
  await task.populate('owner').execPopulate();
  console.log(task);
  console.log(task.owner); */

  // 600d4e782a9804946ff5f142

  const user = await User.findById(userId);
  await user.populate('tasks').execPopulate();
  // console.log(user.tasks);
};

main();
// Generate a token secret:
/* const crypto = require('crypto');
require('crypto').randomBytes(64).toString('hex') */
