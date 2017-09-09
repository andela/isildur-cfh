import async from 'async';
// const async = require('async');

// User Controllers
import users from '../app/controllers/users';
// Answer Controllers
import answers from '../app/controllers/answers';
// Questions Controllers
import questions from '../app/controllers/questions';
// Avatar Controllers
import avatars from '../app/controllers/avatars';
// Root Controllers
import index from '../app/controllers/index';
// GameLog controller
import gamelog from '../app/controllers/gameLog';


module.exports = (app, passport, auth) => {
  // User Routes
  // const users = require('../app/controllers/users');
  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/chooseavatars', users.checkAvatar);
  app.get('/signout', users.signout);

  // Setting up the users api
  app.post('/users/avatars', users.avatars);

  // signup a user
  app.post('/api/auth/signup', users.create);

  // Donation Routes
  app.post('/donations', users.addDonation);

  // login a user
  app.post('/api/auth/login', users.login);

  app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

  // Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Finish with setting up the userId param
  app.param('userId', users.user);

  // Answer Routes
  // const answers = require('../app/controllers/answers');
  app.get('/answers', answers.all);
  app.get('/answers/:answerId', answers.show);
  // Finish with setting up the answerId param
  app.param('answerId', answers.answer);

  // Question Routes
  //   const questions = require('../app/controllers/questions');
  app.get('/questions', questions.all);
  app.get('/questions/:questionId', questions.show);
  // Finish with setting up the questionId param
  app.param('questionId', questions.question);

  // Avatar Routes
  //   const avatars = require('../app/controllers/avatars');
  app.get('/avatars', avatars.allJSON);

  // Home route
  //   const index = require('../app/controllers/index');
  app.get('/play', index.play);
  app.get('/', index.render);

  // Endpoint to search and Invite Users to Game
  app.get('/api/users/search', users.search);
  //  app.post('/api/user/invite/:user_details', users.invitePlayers);
  app.post('/api/games/:id/start', gamelog.create);

  // Send Invites to users in the game to show on their notifications table
  app.post('/api/users/sendInvitation', users.sendInviteAsEmail);

  // Send Invites to users in the game to show on their notifications table
  // app.post('/api/user/invite/:userDetails', users.invitePlayers);
};
