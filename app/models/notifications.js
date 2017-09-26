/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  // config = require('../../config/config'),
  Schema = mongoose.Schema;


/**
* Notifications Schema
*/
const NotificationsSchema = new Schema({
  sender: {
    type: String,
    default: '',
    trim: true
  },
  reciever: {
    type: String,
    default: '',
    trim: true
  },
});

/**
* Statics
*/
// NotificationsSchema.statics = {
// load: function(id, cb) {
//     this.findOne({
//         id: id
//     }).select('-_id').exec(cb);
// }
// };

mongoose.model('Notifications', NotificationsSchema);
