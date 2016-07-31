/**
 * Created by Tdh4vn on 7/31/2016.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var imageSchema = new Schema({
    description : String,
    url : String
});

module.exports = mongoose.model('Image', imageSchema);
