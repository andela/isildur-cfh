/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  // config = require('../../config/config'),
  Schema = mongoose.Schema;

/**
* GameLog Schema
*/
const GameLog = new Schema({
  id: {
    type: Number
  },
  playerId: {
    type: String
  },
  gameId: {
    type: String
  },
  winner: {
    type: String
  },
  players: {
    type: Array
  },
  rounds: {
    type: Number
  }
});

/**
* Statics
*/
GameLog.statics = {
  load: (id, cb) => {
    this.findOne({
      id
    }).select('-_id').exec(cb);
  }
};

mongoose.model('GameLog', GameLog);
