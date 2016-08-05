/**
 * Created by Tdh4vn on 7/26/2016.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    facebook_id : String,
    google_id : String,
    email : String,
    name : String,
    avatar : String,
    banner : String,
    follows : [{
        type : Schema.Types.ObjectId,
        ref: 'User'
    }],
    birthday : {type: Date, default: Date.now},
    access_token: String,
    status : Number
});

module.exports = mongoose.model('User', userSchema);