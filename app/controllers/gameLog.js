import jwt from 'jsonwebtoken';
/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  GameLog = mongoose.model('GameLog');

/**
 * create - create GameLog
 *
 * @param  {object} req incoming request object
 * @param  {object} res response object from the server
 * @return {json}     returns json reponse
 */
exports.create = (req, res) => {
  if (req.params.id &&
      req.body.playerId &&
      req.body.gameId &&
      req.body.winner &&
      req.body.players &&
      req.body.rounds) {
    const gamelog = new GameLog(req.body);
    gamelog.save((err) => {
      if (err) {
        return res.status(400).send({
          message: 'Cannot save gamelog'
        });
      }
      return res.status(201).send({
        message: 'Gamelog saved successfully!'
      });
    });
  } else {
    return res.status(409).send({
      message: 'Incomplete Gamelog parameter'
    });
  }
};

/**
 * create - create GameLog
 *
 * @param  {object} req incoming request object
 * @param  {object} res response object from the server
 * @return {json}     returns json reponse
 */
exports.retrieveGamelog = (req, res) => {
  const playerId = jwt.decode(req.headers.token).id;
  GameLog.find({ playerId }).select('-_id').exec((err, gameLogs) => {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.json(gameLogs);
    }
  });
};


const leaderboard = (object) => {
  const rank = {};
  object.map((item) => {
    if (item.winner in rank) {
      rank[item.winner] += 1;
    } else {
      rank[item.winner] = 1;
    }
    return null;
  });
  const keys = Object.keys(rank);
  const values = Object.keys(rank).map(val =>
    rank[val]
  );
  const len = keys.length;
  let i = 0;
  const obj = {};
  values.sort((a, b) => b - a);
  for (i = 0; i < len; i += 1) {
    const k = keys[i];
    const v = rank[k];
    obj[k] = v;
  }
  return obj;
};


/**
 * create - create GameLog
 *
 * @param  {object} req incoming request object
 * @param  {object} res response object from the server
 * @return {json}     returns json reponse
 */
exports.retrieveLeaderBoard = (req, res) => {
  GameLog.find().select('-_id').exec((err, leaderBoard) => {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.json(leaderboard(leaderBoard));
    }
  });
};
