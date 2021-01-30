const app = require('./app');
const log = require('./utils/log');

const port = process.env.PORT;

app.listen(port, () => {
  log.info('Server is up on port:', port);
});
