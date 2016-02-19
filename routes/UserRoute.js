var User = require('../models/user').User;
var ObjectID = require('mongodb').ObjectID;

exports.get = function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
    } catch (e) {
        return next(404);
    }

    User.findById(id, function (err, user) { // ObjectID
        if (err) return next(err);
        if (!user) {
            return next(404);
        }
        res.render('UserPage.ejs', {user:user});
    });
};




