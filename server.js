/**
 * Module dependencies.
 */
// import dotenv from 'dotenv';
// import express from 'express';
// import cookieParser from 'cookie-parser';
// import expressSession from 'express-session';
// import MongoStore from 'connect-mongo';
// import mongoose from 'mongoose';

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);

// MongoStore(expressSession);
// dotenv.config();

const app = express();
const fs = require('fs');
const passport = require('passport');
const logger = require('mean-logger');
const io = require('socket.io');

// Load configurations
// import config from './config/config';
// import auth from './config/middlewares/authorization';


/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
// Load configurations
// if test env, load example file
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
  config = require('./config/config'),
  auth = require('./config/middlewares/authorization'),
  mongoose = require('mongoose');


// Bootstrap db connection
// const db = mongoose.connect(config.db, {
//     useMongoClient: true
//   });
const options = {
  server: { socketOptions: { keepAlive: 600000, connectTimeoutMS: 60000 } },
  replset: { socketOptions: { keepAlive: 600000, connectTimeoutMS: 60000 } }
};

const db = mongoose.connect(config.db, options);

// Bootstrap models
const modelsPath = `${__dirname}/app/models`;
const walk = (path) => {
  fs.readdirSync(path).forEach((file) => {
    const newPath = `${path}/${file}`;
    const stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(newPath);
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};
walk(modelsPath);

// bootstrap passport config
require('./config/passport')(passport);

// store: new MongoStore({
//     mongooseConnection: mongoose.connection
// });
// const app = express();
app.use(cookieParser());
app.use(expressSession({
  secret: 'isildur',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  next();
});

// express settings
require('./config/express')(app, passport, mongoose);

// Bootstrap routes
require('./config/routes')(app, passport, auth);

// Start the app by listening on <port>
const port = config.port;
const server = app.listen(port);
const ioObj = io.listen(server, { log: false });

// game logic handled here
require('./config/socket/socket')(ioObj);

console.log(`Express app started on port ${port}`);

// Initializing logger
logger.init(app, passport, mongoose);

// expose app
module.exports = app;
