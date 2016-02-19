/* GET home page. */
exports.get = function (req, res) {
    res.render('HomePage.ejs', {what: 'best', who: 'me'});
};
