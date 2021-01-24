const { MongoClient } = require('mongodb');
const log = require('./utils/log');

const connectionURL = 'mongodb://127.0.0.1:27017';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (e) => {
  log.info('Attempting to connect to db: ' + connectionURL);
  if (e) {
    return log.error('Unable to connect, terminating application');
  }
  log.success('Connected to db successfully');
});
