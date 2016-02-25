var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var MongoError = require('../node_modules/mongodb-core/lib/error.js');

/* GET register page. */
exports.get = function (req, res) {
    res.render('RegisterPage.ejs', {});
};

/*Process POST from register page*/
exports.post = function (req, res, next) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    User.register(username, email, password, function (err, user) {
        if (err) {
            if (err instanceof MongoError) {
                console.log(err.message);
                return next(new HttpError(403, "User with such username/e-mail is already registered"));
            } else {
                return next(err);
            }
        }
        req.session.user = user._id;
        res.status(200).end();
    });
};