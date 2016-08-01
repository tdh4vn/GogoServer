/**
 * Created by Tdh4vn on 7/31/2016.
 */

var Post = require('../model/post');
var ImageGroupController = require('../controller/image_group');
var async = require('async');
var mongoose = require('mongoose');

exports.upPost = function (req, res) {
    var imageGroups = req.body.image_groups;
    async.waterfall([
        function (done) {
            var newPost = new Post({
                note : req.body.note,
                author : req.user._id,
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

exports.getPosts = function (opts, page, callback) {
    var result = [];
    Post.find(opts)
        .populate('author')
        .populate('comments')
        .populate('likes')
        .populate('image_groups')
        .populate('user_tagged')
        .populate('category')
        .sort({'created' : -1})
        .skip(20 * (page - 1))
        .limit(20)
        .exec(function (err, posts) {
            async.each(posts, function (post, cb1) {
                var author =  {
                    id : post.author._id,
                    name : post.author.name,
                    avatar : post.author.avatar
                };
                var comments = [];
                var likes = [];
                var userTagged = [];
                var imageGroups = [];

                for (var i = 0; i < post.comments.length; i++){
                    var userTaggedComment = [];
                    for (var j = 0; j < post.comments[i].user_tagged.length; j++){
                        userTaggedComment.push({
                            id : post.comments[i].user_tagged[j]._id,
                            name : post.comments[i].user_tagged[j].name,
                            avatar : post.comments[i].user_tagged[j].avatar
                        });
                    }
                    comments.push({
                        author : {
                            id : post.comments[i].author._id,
                            name : post.comments[i].author.name,
                            avatar : post.comments[i].author.avatar
                        },
                        content : post.comments[i].content,
                        created : post.comments[i].created,
                        user_tagged : userTaggedComment
                    });
                }

                for (var i = 0; i < post.likes.length; i++){
                    likes.push({
                        id : post.likes[i]._id,
                        name : post.likes[i].name,
                        avatar : post.likes[i].avatar
                    });
                }

                for (var i = 0; i < post.user_tagged.length; i++){
                    userTagged.push({
                        id : post.user_tagged[i]._id,
                        name : post.user_tagged[i].name,
                        avatar : post.user_tagged[i].avatar
                    });
                }

                for (var i = 0; i < post.image_groups.length; i++){
                    var photos = [];
                    for (var j = 0; j < post.image_groups[i].photos.length; j++){
                        photos.push({
                            url : post.image_groups[i].photos[j].url
                        });
                    }
                    imageGroups.push({
                        title : post.image_groups[i].title,
                        photos : photos
                    });
                }
                result.push({
                    id : post._id,
                    author : author,
                    category : post.category._id,
                    comments : comments,
                    likes : likes,
                    user_tagged : userTagged,
                    image_groups : imageGroups,
                    created : post.created,
                    note : post.note,
                    location : location
                });
                cb1();
            }, function (err) {
                return callback(err, result);
            })
        })

};
