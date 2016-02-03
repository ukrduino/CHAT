var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('HomePage.ejs', {what: 'best', who: 'me'});
});

/* GET login page. */
router.get('/login', function (req, res) {
    res.render('LoginPage.ejs', {});
});

/* GET register page. */
router.get('/register', function (req, res) {
    res.render('RegisterPage.ejs', {});
});

/* GET lobby page. */
router.get('/lobby', function (req, res) {
    res.render('LobbyPage.ejs', {});
});

/* GET chat room page. */
router.get('/1', function (req, res) {
    res.render('ChatRoomPage.ejs', {});
});

module.exports = router;
