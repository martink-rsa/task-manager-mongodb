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

// Generate a token secret:
/* const crypto = require('crypto');
require('crypto').randomBytes(64).toString('hex') */
