const express = require('express');
const log = require('./utils/log');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Load the Mongoose file which has the MongoDB connection
require('./db/mongoose');

// Mongoose models
const User = require('./models/user');
const Task = require('./models/task');

// Routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
app.use(userRouter);
app.use(taskRouter);

app.use(express.json());

/* --- USERS --- */

/* --- TASKS --- */

app.listen(port, () => {
  log.info('Server is up on port:', port);
});
