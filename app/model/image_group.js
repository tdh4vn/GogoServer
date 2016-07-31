/**
 * Created by Tdh4vn on 7/26/2016.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var imageGroupSchema = new Schema({
    title : String,
    photos : [{
        type : Schema.Types.ObjectId,
        ref : 'Image'
    }]
});

module.exports = mongoose.model('ImageGroup', imageGroupSchema);
