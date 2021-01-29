const mongoose = require('mongoose');
const log = require('../utils/log');

mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.log(err);
      log.error('MongoDB is not connected');
    } else {
      log.info('Connected to MongoDB database:', process.env.MONGODB_URL);
    }
  }
);
