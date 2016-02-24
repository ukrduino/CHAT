var checkAuth = require('../middleware/checkAuth');

module.exports = function(app) {
    app.get('/', require('./HomePageRoute').get);
    app.get('/login', require('./LoginPageRoute').get);
    app.post('/login', require('./LoginPageRoute').post);
    app.post('/logout', require('./LogOutRoute').post);
    app.get('/register', require('./RegisterPageRoute').get);
    app.get('/lobby', checkAuth, require('./LobbyPageRoute').get);
    app.get('/users', require('./UsersRoute').get);
    app.get('/user/:id', require('./UserRoute').get);
};