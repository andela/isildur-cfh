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


const leaderboard = (gameLog) => {
  const rank = {};
  const leaders = [];
  gameLog.forEach((element) => {
    const playersCount = rank[element.winner];
    if (playersCount) {
      rank[element.winner] += 1;
    } else {
      rank[element.winner] = 1;
    }
  });
  Object.keys(rank).forEach((rankElement) => {
    leaders.push({ username: rankElement, noOfWins: rank[rankElement] });
  });
  return leaders;
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
