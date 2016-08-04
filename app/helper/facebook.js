/**
 * Created by Tdh4vn on 8/4/2016.
 */
var https = require('https');
var async = require('async');

exports.getFbData = function(accessToken, userId, callback) {
    var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: '/v2.7/' + userId + '/friends?access_token=' + accessToken, //apiPath example: '/me/friends'
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
            async.each(rs.data,
                function (user, cb) {
                    userList.push(user.id);
                    cb();
                },
                function (err) {
                    if (rs.paging.next){
                        callback(null, userList, rs.paging.next);
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


exports.getFbDataByUrl = function (url, callback) {
    var buffer = '';
    var request = https.get(url, function (result) {
        result.setEncoding('utf8');
        result.on('data', function(chunk){
            buffer += chunk;
        });
        var userList = [];
        result.on('end', function(){
            var rs = JSON.parse(buffer);
            async.each(rs.data,
                function (user, cb) {
                    userList.push(user.id);
                    cb();
                },
                function (err) {
                    if (rs.paging.next){
                        callback(null, userList, rs.paging.next);
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

