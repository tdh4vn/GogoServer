/**
 * Created by Tdh4vn on 7/26/2016.
 */
var async = require('async');
var UUID = require('node-uuid');
var User = require('../model/user');
var Post = require('../controller/post');
var mongoose = require('mongoose');
var fbHelper = require('../helper/facebook');

exports.login = function (req, res) {
    var fbID = req.body.facebook_id | '-';
    var ggID = req.body.google_id | '-';

    async.waterfall([
            function (done) {
                //check user in database
                User.findOne({
                    $or : [{facebook_id : fbID},{google_id : ggID}]
                }, function (err, user) {
                    if (err){
                        done(err);
                    } else if (!user){
                        //if user not exist -> create new user with data in request and default data
                        var newUser = new User({
                            last_name: req.body.last_name,
                            first_name: req.body.first_name,
                            email: req.body.email,
                            birthday: new Date(req.body.birthday),
                            follows: [],
                            status : 1
                        });
                        newUser.avatar = !req.body.avatar ? req.header.host + '/public/img/avatar_default.png' : req.body.avatar;
                        newUser.facebook_id = !fbID ? null : fbID;
                        newUser.banner = !req.body.banner ? req.header.host + '/public/img/banner_default.png' : req.body.banner;
                        newUser.access_token = UUID.v4();
                        newUser.save(function (err) {
                            done(err, newUser, true);
                        });
                    } else {
                        //if avatar or header image(banner) was change -> update them
                        if (user.avatar.localeCompare(req.header.host + '/public/img/avatar_default.png') == 0){
                            user.avatar = req.body.avatar;
                        }

                        if (user.banner.localeCompare(req.header.host + '/public/img/banner_default.png') == 0){
                            user.banner = req.body.banner;
                        }
                        done(null, user, false);
                    }
                });
            },
            function (user, firstLogin, done) {
                if (!firstLogin){
                    Post.getPosts({}, 1, function (err, posts) {
                        done(err, user, posts, null);
                    });
                } else {
                    async.parallel({
                        rs_posts: function (callback) {
                            Post.getPosts({}, 1, function (err, posts) {
                                callback(err, posts);
                            });
                        },
                        rs_friends: function (callback) {
                            //get friend can follow
                            if (fbID) {
                                //get friend with facebook
                                fbHelper.getFbData(req.body.facebook_token, fbID
                                    , function (err, ids, url) {
                                        if (err){
                                            callback(err, null);
                                        } else {
                                            if (url) {
                                                user.tmp_next_paging = url;
                                                user.save();
                                            }
                                            findFriendByFacebookIds(ids, function (err, friends) {
                                                callback(err, friends);
                                            })
                                        }
                                    });
                            } else {
                                //get friend with gooogle +
                            }
                        }
                    }, function (err, results) {
                        done(err, results.rs_posts, results.rs_friends);
                    })
                }

            }
        ],
        function (err, user, posts, friends) {
            if (err){
                res.json({
                    code : 6,
                    message : 'Có lỗi xảy ra, vui lòng đăng nhập lại'
                });
            } else {
                res.json({
                    code : 1,
                    message : '',
                    access_token : user.access_token,
                    avatar : user.avatar,
                    name : user.name,
                    email : user.email,
                    posts : posts,
                    friends : friends
                });
            }
        }
    );
};


/**
 * get friend suggest of facebook
 * @param req
 * @param res
 */
exports.getFriendSuggest = function (req, res) {
    if (req.user.tmp_next_paging){
        res.json({

        });
    } else {
        fbHelper.getFbDataByUrl(req.user.tmp_next_paging
            , function (err, ids, url) {
                if (err){
                    res.json({
                        code : 3
                    });
                } else {
                    if (url) {
                        user.tmp_next_paging = url;
                        user.save();
                    }
                    findFriendByFacebookIds(ids, function (err, friends) {
                        callback(err, friends);
                    })
                }
            });
    }

};

exports.logout = function (req, res) {
    User.update({
        _id: req.user._id
    }, {
        access_token: UUID.v4()
    }, function (err) {
        if (err) {
            res.json({
                code: 6,
                message: 'Xảy ra lỗi, vui lòng thử lại sau'
            });
        } else {
            req.user = undefined;
            res.json({
                code: 1
            });
        }
    });
};

exports.getUser = function (req, res) {
    User.findOne({_id : req.params.id}, function (err, user) {
        if (err){
            res.json({
                code : 3,
                message : 'Không tìm thấy người dùng'
            });
        } else {
            res.json({
                code : 1,
                message : '',
                result : user
            });
        }
    })
};


/**
 * function for follow user
 * @param access_token access_token of user want follow
 * @param user_id id of user need follow
 */
exports.followUser = function (req, res) {
    var userFollowID = req.params.id;
    var user = req.user;
    User.update({
        _id: user._id
    },{
        $push:{
            follows: mongoose.Types.ObjectId(userFollowID)
        }
    }, function (err) {
        if (err){
            res.json({
                code : 3,
                message : 'Có lỗi. Vui lòng thử lại sau.'
            });
        } else {
            res.json({
                code : 1,
                message : 'Theo dõi thành công'
            });
        }
    });
};

/**
 * function for unfollow user
 * @param access_token
 * @param user_id
 * @param callback
 */

exports.unfollowUser = function (req, res){
    var userFollowID = req.params.id;
    var user = req.user;
    User.update({
            _id: user._id
        },{
            $pull:{
                follows: userFollowID
            }
        }, function (err) {
            if (err){
                res.json({
                    code : 3,
                    message : 'Người này đã không còn trong danh sách bạn theo dõi'
                });
            } else {
                res.json({
                    code : 1,
                    message : 'Hủy theo dõi thành công'
                });
            }
        });
};

/**
 * find friends's user by list friend in user facebook's
 * @param fbids
 * @param callback
 */
var findFriendByFacebookIds = function (fbids, callback) {
    var friendrq = [];

    User.find({facebook_id: {$in: ids}})
        .exec(function (err, users) {
            if(err){
                callback(err, null)
            } else {
                async.each(
                    users,
                    function (user, cb) {
                        friendrq.push({
                            id : user._id,
                            avatar : user.avatar,
                            name : user.name
                        });
                        cb();
                    },
                    function (err) {
                        callback(err, friendrq);
                    }
                );
            }
        });
};


