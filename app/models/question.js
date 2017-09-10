/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


/**
 * Question Schema
 */
var QuestionSchema = new Schema({
    id: {
        type: Number
    },
    text: {
        type: String,
        default: '',
        trim: true
    },
    numAnswers: {
        type: Number
    },
    official: {
        type: Boolean
    },
    expansion: {
        type: String,
        default: '',
        trim: true
    },
    region: {
        type: String,
        default: '',
        trim: true,
        lowercase: true
    }
});

/**
 * Statics
 */
QuestionSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            id: id
        }).select('-_id').exec(cb);
    }
};

mongoose.model('Question', QuestionSchema);
