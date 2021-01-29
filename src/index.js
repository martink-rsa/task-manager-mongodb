const express = require('express');
const log = require('./utils/log');
// Routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
// Middleware

require('./emails/account');

// Load the Mongoose file which has the MongoDB connection
require('./db/mongoose');

const app = express();
const port = process.env.PORT;

app.use(express.json());

// Routers
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  log.info('Server is up on port:', port);
});
