/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  // config = require('../../config/config'),
  Schema = mongoose.Schema;


/**
* Friends Schema
*/
const FriendsSchema = new Schema({
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

mongoose.model('Friends', FriendsSchema);
