/**
 * Created by Tdh4vn on 7/26/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var commentSchema = new Schema({
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content : String,
    created : {
        type : Date,
        default : Date.now
    },
    user_tagged : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }]
});

module.exports = mongoose.model('Comment', commentSchema);
