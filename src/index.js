const express = require('express');
const log = require('./utils/log');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Load the Mongoose file which has the MongoDB connection
require('./db/mongoose');

// Routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  log.info('Server is up on port:', port);
});
