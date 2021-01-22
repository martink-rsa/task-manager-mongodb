const chalk = require('chalk');

const log = {
  error: (...params) => {
    console.log(chalk.red.bold('Error: \t'), ...params);
  },
  info: (...params) => {
    console.log(chalk.blue.bold('Info: \t'), ...params);
  },
  success: (...params) => {
    console.log(chalk.green.bold('Success:'), ...params);
  },
  warn: (...params) => {
    console.log(chalk.yellow.bold('Warn: \t'), ...params);
  },
};

module.exports = log;
