const { MongoClient, ObjectID } = require('mongodb');
const chalk = require('chalk');
const log = require('./utils/log');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID();

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    log.info('Attempting to connect to db: ' + connectionURL);
    if (error) {
      return log.error('Unable to connect, terminating application');
    }
    log.success('Connected to db successfully');
    const db = client.db(databaseName);

    /* db.collection('users').insertOne(
      {
        name: 'Martin ID',
        location: 'RSA',
      },
      (error, result) => {
        if (error) {
          return msg.error('Unable to insert user');
        }
        msg.info(result.ops);
      },
    ); */

    /* db.collection('users').insertMany(
      [
        {
          name: 'Jen',
          location: 'US',
        },
        {
          name: 'John',
          location: 'ZA',
        },
      ],

      (error, result) => {
        if (error) {
          return msg.error('Unable to insert documents');
        }
        msg.info(result.ops);
      },
    ); */
    /* db.collection('tasks').insertMany(
      [
        {
          description: 'Sweep floors',
          completed: false,
        },
        {
          description: 'Clean dishes',
          completed: false,
        },
        {
          description: 'Cook food',
          completed: true,
        },
      ],
      (error, result) => {
        if (error) {
          return msg.error('Unable to insert tasks');
        }
        msg.info(result.ops);
      },
    ); */

    /* db.collection('users').findOne(
      { _id: new ObjectID('5f93c5e1677e20200a26da97') },
      (error, response) => {
        if (error) {
          return msg.error('Unable to fetch');
        }
        if (!response) {
          return msg.warn('0 results');
        }
        msg.info(response);
      },
    ); */

    /* db.collection('users')
      .find({ location: 'ZA' })
      .toArray((error, response) => {
        if (error) {
          return msg.error('Unable to fetch');
        }
        if (!response) {
          return msg.warn('0 results');
        }
        msg.info(response);
      }); */

    /* db.collection('tasks').findOne(
      { _id: new ObjectID('5f93ca2ffeef6c34a307914f') },
      (error, response) => {
        if (error) {
          return msg.error('Unable to fetch');
        }
        if (!response) {
          return msg.error('No record found');
        }
        return msg.info(response);
      },
    );

    db.collection('tasks')
      .find({ completed: false })
      .toArray((error, response) => {
        if (error) {
          return msg.error('Unable to fetch');
        }
        if (!response) {
          return msg.warn('0 results');
        }
        msg.info(response);
      }); */

    /* const updatePromise = db.collection('users').updateOne(
      {
        _id: new ObjectID('5f927e9dcee51c625dbe9e95'),
      },
      {
        $set: {
          name: 'NotMartin',
          age: 55,
        },
      },
    ); */

    /* const updatePromise = db.collection('users').updateOne(
      {
        _id: new ObjectID('5f927e9dcee51c625dbe9e95'),
      },
      {
        $inc: {
          age: 1,
        },
      },
    ); */

    /* db.collection('tasks')
      .updateMany(
        { completed: true },
        {
          $set: {
            completed: false,
          },
        },
      )
      .then((result) => {
        console.log(result.modifiedCount);
      })
      .catch((error) => {
        console.log(error);
      }); */

    /* db.collection('tasks')
      .insertOne({
        description: 'Sweep floors',
        completed: false,
      })
      .then((res) => console.log(res.insertedCount))
      .catch((err) => console.log(err)); */

    /* db.collection('tasks')
      .deleteOne({ description: 'Sweep floors' })
      .then((res) => console.log(res.deletedCount))
      .catch((err) => console.log(err)); */

    /* .then((result) => console.log(result.deletedCount))
      .catch((error) => console.log(error)); */

    /* updatePromise
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      }); */
  },
);
