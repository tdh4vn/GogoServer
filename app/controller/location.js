/**
 * Created by Tdh4vn on 7/31/2016.
 */

var Location = require('../model/location');

exports.getLocation = function (req, res) {
    Location.find(req.body, function (err, locations) {
        if (err) {
            return res.json({
                code : 6,
                message : "Lỗi không xác định"
            });
        } else {
            var result = [];
            for (var i = 0; i < locations.length; i++) {
                result.push({
                    id: locations[i]._id,
                    province: locations[i].province,
                    district: locations[i].district,
                    town : locations[i].town
                });
            }
            res.json({
                code: 1,
                result: result
            });
        }
    })
};

exports.addLocation = function (location, callback) {
    var newLocation = new Location({
        province : location.province,
        district : location.district,
        town : location.town
    });

    newLocation.save(function (err) {
        if (err){
            callback(err);
        } else {
            callback(null);
        }
    });
};
