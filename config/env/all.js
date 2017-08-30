// import dotenv from 'dotenv';
// import path from 'path';
// const rootPath = path.normalize(`${__dirname}/../..`);

// dotenv.config();
require('dotenv').config();
const path = require('path'),
  rootPath = path.normalize(`${__dirname}/../..`),
  keys = `${rootPath}/keys.txt`;

console.log(process.env.MONGOHQ_URL, '=============>');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  db: process.env.MONGOHQ_URL
};
