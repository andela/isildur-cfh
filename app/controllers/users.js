import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const secret = process.env.SECRET_TOKEN;

/**
 * Module dependencies.
 */
// TODO: Add/Import Email Helper Method and Libraries


const avatars = require('./avatars').all();
// import avatars from './avatars';
// avatar.all();

const User = mongoose.model('User');
// const mongoose = require('mongoose'),
//   User = mongoose.model('User');

/**
 * Signup a new user
 * @param {object} req The user's information
 * @param {object} res The server's response
 * @param {object} next The server's response
 * @returns {object} The server's response
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/chooseavatars');
};

/**
 * Signup a new user
 * @param {object} req The user's information
 * @param {object} res The server's response
 * @returns {object} The server's response
 */
exports.signin = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Signup a new user
 * @param {object} req The user's information
 * @param {object} res The server's response
 * @returns {object} The server's response
 */
exports.signup = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Signup a new user
 * @param {object} req The user's information
 * @param {object} res The server's response
 * @returns {object} The server's response
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Signup a new user
 * @param {object} req The user's information
 * @param {object} res The server's response
 * @returns {object} The server's response
 */
exports.session = function (req, res) {
  res.redirect('/');
};

/**
 * Check Avartar
 * @param {object} req The user's information
 * @param {object} res The server's response
 * @returns {object} The server's response
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
        return res.status(200).send({
          success: true,
          id: user._id,
          name: user.name,
          email: user.email,
          token
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
 * Login a user
 * @param {object} req The user's information
 * @param {object} res The server's response
 * @returns {object} The server's response
 */
exports.login = (req, res) => {
  if (
    req.body.email &&
    req.body.password
  ) {
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      // if an error occurs when finding user
      if (err) {
        return res.status(400).send({
          success: false,
          error: 'invalid'
        });
      }
      // if no user exists
      if (!user) {
        return res.status(400).send({
          success: false,
          error: 'invalid'
        });
      }
      // compare passwords
      if (!bcrypt.compareSync(req.body.password, user.hashed_password)) {
        return res.status(400).send({
          success: false,
          error: 'invalid'
        });
      }

      // sign token
      const token = jwt.sign({
        name: user.name,
        email: user.email,
        id: user._id
      }, secret);

      // login user
      return res.status(200).send({
        success: true,
        id: user._id,
        name: user.name,
        email: user.email,
        token
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
 * Login a user
 * @param {object} req The user's information
 * @param {object} res The server's response
 * @returns {object} The server's response
 */
exports.retrieveDonation = (req, res) => {
  const email = jwt.decode(req.headers.token).email;
  User.find({ email }).select('-_id').exec((err, user) => {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.json(user[0].donations);
    }
  });
};

/**
 * Avartar
 * @param {object} req The user's information
 * @param {object} res The server's response
 * @returns {object} The server's response
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
          for (let i = 0; i < user.donations.length; i += 1) {
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
 * show a user
 * @param {object} req The user's information
 * @param {object} res The server's response
 * @returns {object} The server's response
 */
exports.show = function (req, res) {
  const user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};
/**
 * me
 * @param {object} req The user's information
 * @param {object} res The server's response
 * @returns {object} The server's response
 */
exports.me = function (req, res) {
  res.jsonp(req.user || null);
};

/**
 * User
 * @param {object} req The user's information
 * @param {object} res The server's response
 * @param {object} next The next action
 * @param {object} id The user id
 * @returns {object} The server's response
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
