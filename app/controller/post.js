/**
 * Created by Tdh4vn on 7/31/2016.
 */

var Post = require('../model/post');
var ImageGroupController = require('../controller/image_group');
var async = require('async');

exports.upPost = function (req, res) {
    var imageGroups = req.body.image_groups;
    async.waterfall([
        function (done) {
            var newPost = new Post({
                note : req.body.note,
                author : req.body.user._id,
                user_tagged : req.body.user_tagged,
                category : req.body.category,
                likes : [],
                created : Date.now,
                comments : [],
                image_groups : [],
                location : req.body.location
            });
            done(null, newPost);
        },
        function (newPost, done) {
            async.each(imageGroups,
                function (imageGroup, callback) {
                    ImageGroupController.addImageGroup(imageGroup, function (err, imageGroup_id) {
                        if (err){
                            callback(err);
                        } else {
                            newPost.image_groups.push(imageGroup_id);
                            callback();
                        }
                    })
                },
                function (err) {
                    done(err, newPost);
                }
            )
        }
    ],
    function (err, newPost) {
        newPost.save(function (err) {
            if (err){
                res.json({
                    code : 6,
                    message : 'Thêm bài viết mới thất bại'
                });
            } else {
                res.json({
                    code : 1,
                    message : 'Thành công'
                });
            }
        })
    })
};

exports.getNewPost = function (req, res) {
    //TODO
};
