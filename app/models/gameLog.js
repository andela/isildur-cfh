/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
config = require('../../config/config'),
Schema = mongoose.Schema;

/**
* GameLog Schema
*/
var GameLog = new Schema({
id: {
    type: Number
},
gameId: {
    type: Number
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
load: function(id, cb) {
    this.findOne({
        id: id
    }).select('-_id').exec(cb);
}
};

mongoose.model('GameLog', GameLog);