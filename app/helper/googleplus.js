/**
 * Created by Tdh4vn on 8/4/2016.
 */
var https = require('https');
var async = require('async');
//https://developers.google.com/oauthplayground/
//https://www.googleapis.com/plus/v1/people/107157062348896425085/people/visible?access_token=ya29.Ci81A5ZvIWX9vdW0aACftRhsMUKKUAQZLHeSZFXnlgezX-PUKwGwsiXNvQW6hrUQMQ
exports.getFriendSuggestOnGooglePlus = function(accessToken, userId, callback) {
    var options = {
        host: 'googleapis.com',
        port: 443,
        path: '/plus/v1/people/' + userId + '/people/visible?access_token=' + accessToken, //apiPath example: '/me/friends'
        method: 'GET'
    };

    var buffer = ''; //this buffer will be populated with the chunks of the data received from facebook
    var request = https.get(options, function(result){
        result.setEncoding('utf8');
        result.on('data', function(chunk){
            buffer += chunk;
        });
        var userList = [];
        result.on('end', function(){
            var rs = JSON.parse(buffer);
            console.log(typeof rs);
            async.each(rs.items,
                function (user, cb) {
                    userList.push(user.id);
                    cb();
                },
                function (err) {
                    if (rs.nextPageToken){
                        callback(null, userList, rs.nextPageToken);
                    } else {
                        callback(null, userList, null);
                    }
                }
            );
        });
    });

    request.on('error', function(e){
        callback(e, null, null);
        console.log('error from facebook.getFbData: ' + e.message)
    });

    request.end();
};

exports.getFriendSuggestOnGooglePlusPaging = function(accessToken, userId, nextPageToken, callback) {
    var options = {
        host: 'googleapis.com',
        port: 443,
        path: '/plus/v1/people/' + userId + '/people/visible?pageToken='+ nextPageToken +'&access_token=' + accessToken, //apiPath example: '/me/friends'
        method: 'GET'
    };

    var buffer = ''; //this buffer will be populated with the chunks of the data received from facebook
    var request = https.get(options, function(result){
        result.setEncoding('utf8');
        result.on('data', function(chunk){
            buffer += chunk;
        });
        var userList = [];
        result.on('end', function(){
            var rs = JSON.parse(buffer);
            console.log(typeof rs);
            async.each(rs.items,
                function (user, cb) {
                    userList.push(user.id);
                    cb();
                },
                function (err) {
                    if (rs.nextPageToken){
                        callback(null, userList, rs.nextPageToken);
                    } else {
                        callback(null, userList, null);
                    }
                }
            );
        });
    });

    request.on('error', function(e){
        callback(e, null, null);
        console.log('error from facebook.getFbData: ' + e.message)
    });

    request.end();
};