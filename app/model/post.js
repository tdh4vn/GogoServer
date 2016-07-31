/**
 * Created by Tdh4vn on 7/26/2016.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
    note : String,
    location : {
        province : String,
        district : String,
        town : String
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    comments : [{
        type : Schema.Types.ObjectId,
        ref : 'Comment'
    }],
    likes : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    image_groups : [{
        type : Schema.Types.ObjectId,
        ref : 'ImageGroup'
    }],
    created : {
        type : Date,
        default : Date.now
    },
    user_tagged : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    category : {
        type : Schema.Types.ObjectId,
        ref : 'Category'
    }
});

module.exports = mongoose.model('Post', postSchema);
