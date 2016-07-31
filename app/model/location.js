/**
 * Created by Tdh4vn on 7/26/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
    province : String,
    district : String,
    town : String
});

module.exports = mongoose.model('Location', locationSchema);
