/**
 * Created by Tdh4vn on 7/26/2016.
 */
var async = require('async');
var UUID = require('node-uuid');
var User = require('.app/model/user');


exports.login = function (req, res) {
    var fbID = req.body.facebook_id | '-';
    var ggID = req.body.google_id | '-';

    async.waterfall([
            function (loginDone) {
                //check user in database
                User.findOne({
                    $or : [{facebook_id : fbID},{google_id : ggID}]
                }, function (err, user) {
                    if (err){
                        loginDone(err);
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
                            loginDone(err, newUser, true);
                        });
                    } else {
                        //if avatar or header image(banner) was change -> update them
                        if (user.avatar.localeCompare(req.header.host + '/public/img/avatar_default.png') == 0){
                            user.avatar = req.body.avatar;
                        }

                        if (user.banner.localeCompare(req.header.host + '/public/img/banner_default.png') == 0){
                            user.banner = req.body.banner;
                        }
                        loginDone(null, user, false);
                    }
                });
            },
            function (user, loginDone) {
                //get new post(time line, 20 record)
            }
        ],
        function (err, user, firstLogin) {
            //function called when all function above this
        }
    );
};


