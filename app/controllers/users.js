
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import _ from 'lodash';
import sendEmailInvite from './../utils/sendEmail';

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
      req.login(user, (err) => {
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

// Search all Users registered in app
module.exports.search = (req, res) => {
  const searchQuery = req.query.name;
  User.find({ name: { $regex: `.*${searchQuery}.*` } })
    .select('name email')
    .then((allUsers) => {
      res.status(200)
        .json(allUsers);
    }).catch((error) => {
      res.status(500)
        .json({ message: 'An error Occured', error });
    });
};


// module.exports.allUsers = (req, res) => {
//   // get all the users from mongoDB
//   User.find({}, (err, users) => {
//     if (err) {
//       return res.json({ err });
//     }
//     return res.json(users);
//   });
// };

// Get all user in the datatabase
// module.exports.allUsers = (req, res, next) => {
//   if (req.user) {
//     // get all the users from mongoDB except current user
//     User.find({ $ne: { email: req.user.email } })
//       .select('name email')
//       // .exec((err, allUsers) => {
//       //   if (err) return res.json({ err });
//       //   if (!allUsers) return next(new Error('Failed to load Users'));
//       //   return res.json(allUsers);
//       // });
//       .then(allUsers => res.status(200).json(allUsers))
//       .catch((error) => {
//         res.status(400).json({ message: 'An Error Occured', error });
//       });
//   }
// };

// send invites as email to users who are not friends
module.exports.sendInviteAsEmail = (req, res) => {
  if (req.user) {
    const url = decodeURIComponent(req.body.gameUrl);
    const guestUser = req.body.userEmail;

    if (guestUser !== null && url !== null) {
      sendEmailInvite(guestUser, url);
      res.status(200)
        .json(guestUser);
    } else {
      res.status(400)
        .send('Bad Request !');
    }
  } else {
    res.status(401)
      .send('Hey Kindly Login first!');
  }
};

// send invitation to user as in-app notification
// module.exports.invitePlayers = (req, res) => {
//   console.log('===> inviting User');
// };

// add user as friend

// sendInvites to friends in-app

