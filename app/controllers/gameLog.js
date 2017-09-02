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
