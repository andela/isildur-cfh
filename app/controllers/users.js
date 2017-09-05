import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET_TOKEN;

/**
 * Module dependencies.
 */
// TODO: Add/Import Email Helper Method and Libraries
import mongoose from 'mongoose';

const avatars = require('./avatars').all();
// import avatars from './avatars';
// avatar.all();

const User = mongoose.model('User');
// const mongoose = require('mongoose'),
//   User = mongoose.model('User');

/**
 * Auth callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/chooseavatars');
};

/**
 * Show login form
 */
exports.signin = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Show sign up form
 */
exports.signup = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Logout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Session
 */
exports.session = function (req, res) {
  res.redirect('/');
};

/** 
 * Check avatar - Confirm if the user who logged in via passport
 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 */
exports.checkAvatar = function (req, res) {
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        if (user.avatar !== undefined) {
          res.redirect('/#!/');
        } else {
          res.redirect('/#!/choose-avatar');
        }
      });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/');
  }
};

/**
 * Signup a new user
 * @param {object} req The user's information
 * @param {object} res The server's response
 * @returns {object} The server's response
 */
exports.create = (req, res) => {
  if (
    req.body.name &&
    req.body.name.trim() &&
    req.body.password &&
    req.body.password.length > 7 &&
    req.body.email &&
    validator.isEmail(req.body.email)
  ) {
    User.findOne({
      email: req.body.email
    }).exec((err, existingUser) => {
      if (existingUser) {
        return res.status(400).send({
          success: false,
          error: 'existingUser',
          message: 'A user already exists with that mail'
        });
      }
      // hash password
      const salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);

      const user = new User(req.body);

      // Switch the user's avatar index to an actual avatar url
      user.avatar = avatars[user.avatar];
      user.provider = 'local';
      user.save((err) => {
        if (err) {
          return res.status(400).send({
            success: false,
            message: 'an error occured while trying to save the user'
          });
        }
        // sign token
        const token = jwt.sign({
          name: user.name,
          email: user.email,
          id: user._id
        }, secret);
        // login user
        req.logIn(user, (err) => {
          if (err) {
            return res.status(400).send({
              success: false,
              message: 'error occured on logging in'
            });
          }
          return res.status(201).send({
            success: true,
            token
          });
        });
      });
    });
  } else {
    return res.status(400).send({
      success: false,
      error: 'invalid',
      message: 'Invalid Credentials'
    });
  }
};


/**
 * Assign avatar to user
 */
exports.avatars = function (req, res) {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user && req.user._id && req.body.avatar !== undefined &&
    /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        user.avatar = avatars[req.body.avatar];
        user.save();
      });
  }
  return res.redirect('/#!/app');
};

exports.addDonation = function (req, res) {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
        .exec((err, user) => {
        // Confirm that this object hasn't already been entered
          let duplicate = false;
          for (let i = 0; i < user.donations.length; i++) {
            if (
              user.donations[i].crowdrise_donation_id ===
              req.body.crowdrise_donation_id
            ) {
              duplicate = true;
            }
            if (!duplicate) {
              user.donations.push(req.body);
              user.premium = 1;
              user.save();
            }
          }
        });
    }
    res.send();
  }
};

/**
 *  Show profile
 */
exports.show = function (req, res) {
  const user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = (req, res, next, id) => {
  User
    .findOne({
      _id: id
    })
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return next(new Error(`Failed to load User + ${id}`));
      req.profile = user;
      next();
    });
};

// Get all user in the dtatabase
module.exports.search = (req, res) => {
  // get all the users from mongoDB
  User.find({}, (err, users) => {
    if (err) {
      return res.json({ err });
    }
    return res.json(users);
  });
};

// send an invitation email to user
// module.exports.invitePlayers = (req, res) => {
//   console.log('===> inviting User');
// };
