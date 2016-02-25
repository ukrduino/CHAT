var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../error').AuthError;


/* GET login page. */
exports.get = function (req, res) {
    res.render('LoginPage.ejs');
};

/*Process POST from login page*/
exports.post = function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    User.authorize(username, password, function (err, user) {
        if (err) {
            if (err instanceof AuthError) {
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        }
        req.session.user = user._id;
        res.status(200).end();
    });
};