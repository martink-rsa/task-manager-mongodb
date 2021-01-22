const mongoose = require('mongoose');
const log = require('../utils/log');

const CONNECTION_URL = 'mongodb://127.0.0.1:27017';
const DATABASE_NAME = 'task-manager-api';

mongoose.connect(
  `${CONNECTION_URL}/${DATABASE_NAME}`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      log.error('MongoDB is not connected');
    } else {
      log.info('Connected to MongoDB database');
      log.info('\tURL: ', CONNECTION_URL);
      log.info('\tDB name:', DATABASE_NAME);
    }
  },
);
