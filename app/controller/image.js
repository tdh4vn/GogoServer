/**
 * Created by Tdh4vn on 7/31/2016.
 */

var Image = require('../model/image');

exports.addImage = function (image, callback) {
    var newImage = new Image({
      description : image.description,
      url : image.url
    });

    newImage.save(function (err) {
        if (err){
            callback(err);
        } else {
            callback(null, json({
                id : newImage._id,
                description : newImage.description,
                url : newImage.url
            }));
        }
    });
};
