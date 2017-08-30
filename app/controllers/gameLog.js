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
    if (req.params.id && req.body.winner && req.body.players && req.body.rounds) {
        let gamelog = new GameLog(req.body);
        gamelog.save((err) => {
            res.status(400).send({
                message: 'Cannot save gamelog'
            });
            res.status(200).send({
                message: 'Gamelog saved successfully!'
            });
        })
    }
  };
