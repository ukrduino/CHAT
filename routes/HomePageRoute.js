/* GET home page. */
exports.get = function (req, res) {
    res.render('HomePage.ejs', {userId: req.session.user});
};
