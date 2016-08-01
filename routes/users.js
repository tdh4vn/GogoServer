var express = require('express');
var router = express.Router();
var UserCtr = require('../app/controller/user');
var User = require('../app/model/user');

var PostCtr = require('../app/controller/post');
// var User = require('../app/model/user');


function isVerifiedToken(req, res, next) {
    var accessToken = req.get('Authorization').substring(13);
    User.findOne({access_token: accessToken}, function (err, user) {
        if (err || !user) {
          res.json({
            code: 2,
            message: 'Phiên làm việc hết hạn'
          });
        } else {
          req.user = user;
          return next();
        }
    });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/*=======================Account router============================*/
router.post('/user/login', UserCtr.login);
router.get('/user/logout', isVerifiedToken, UserCtr.logout);
router.get('/user/:id/follow', isVerifiedToken, UserCtr.followUser);
router.delete('/user/:id/follow', isVerifiedToken, UserCtr.unfollowUser);
router.get('/user/:id', isVerifiedToken, UserCtr.getUser);

/*=======================Post router===============================*/
router.post('/post', isVerifiedToken, PostCtr.upPost);
router.get('/post', isVerifiedToken, function (req, res) {
    PostCtr.getPosts(null, req.query.page, function (err, result) {
        if (err){
            res.json({
                code : 3,
                message : 'Có lỗi. Vui lòng thử lại'
            });
        } else {
            res.json({
                code : 1,
                message : '',
                result : result
            });
        }
    })
});

module.exports = router;
