/**
 * Created by Tdh4vn on 7/26/2016.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name : String,
    description : String,
    icon : String
});


module.exports = mongoose.model('Category', categorySchema);