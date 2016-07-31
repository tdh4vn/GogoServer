/**
 * Created by Tdh4vn on 7/31/2016.
 */
var async = require('async');
var ImageGroup = require('../model/image_group');
var ImageController = require('../controller/image');


exports.addImageGroup = function (imageGroup, callback) {
    var title = imageGroup.title;
    var newImageGroup = new ImageGroup({
        title : title,
        photos : []
    });
    async.each(
        imageGroup.photos,
        function (photo, callback) {
            ImageController.addImage(photo, function (err, imageCreated) {
                if (err){
                    callback(err);
                } else {
                    newImageGroup.photos.push(imageCreated._id);
                    callback();
                }
            });
        },
        function (err) {
            if (err){
                console.log('Image Group save fail')
            } else {
                newImageGroup.save(function (err) {
                    if(err){
                        callback(err);
                    } else {
                        callback(null, newImageGroup._id);
                    }
                });
            }
        }
    );
};
