/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../../config/config'),
  Schema = mongoose.Schema;


/**
* Friends Schema
*/
var FriendsSchema = new Schema({
  user: {
    type: String,
    default: '',
    trim: true
  },
  friends: {
    type: Array
  }
});

/**
* Statics
*/
// FriendsSchema.statics = {
// load: function(id, cb) {
//     this.findOne({
//         id: id
//     }).select('-_id').exec(cb);
// }
// };

mongoose.model('Question', FriendsSchema);
