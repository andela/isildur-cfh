/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
async = require('async'),
GameLog = mongoose.model('GameLog'),
_ = require('underscore');


/**
* Create a gamelog
*/
exports.create = function(req, res) {
    if (req.params.id && req.body.gameId && req.body.winner && req.body.players && req.body.rounds) {
        let gamelog = new GameLog(req.body);
        gamelog.save(function (err) {
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
