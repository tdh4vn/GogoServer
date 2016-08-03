/**
 * Created by Tdh4vn on 8/2/2016.
 */


var https = require('https');
var async = require('async');
//my id :100001963495378
exports.getFacebookFriends = function(accessToken, userId, callback) {
    var options = {
        host: 'graph.facebook.com/',
        port: 443,
        path: userId + "/friends?access_token=" + accessToken, //apiPath example: '/me/friends'
        method: 'GET'
    };

    var buffer = ''; //this buffer will be populated with the chunks of the data received from facebook
    var request = https.get(options, function(result){
        result.setEncoding('utf8');
        result.on('data', function(chunk){
            buffer += chunk;
        });
        var ids = [];
        result.on('end', function(){
            async.each(buffer.data,
                function (fbUsr, callback) {
                    ids.push(fbUsr.id);
                    callback();
                },
                function (err) {
                    callback(err, ids);
                }
            );
        });
    });

    request.on('error', function(e){
        callback(e.message, null);
    });

    request.end();
};
