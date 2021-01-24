const express = require('express');
const log = require('./utils/log');
const dotenv = require('dotenv');
// Routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
// Middleware

// Load the Mongoose file which has the MongoDB connection
require('./db/mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routers
app.use(userRouter);
app.use(taskRouter);

const multer = require('multer');
const upload = multer({
  dest: 'images',
});
app.post('/upload', upload.single('upload'), async (req, res) => {
  res.status(200).send({ messsage: 'Success' });
});

app.listen(port, () => {
  log.info('Server is up on port:', port);
});
