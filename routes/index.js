module.exports = function(app) {
    app.get('/', require('./HomePageRoute').get);
    app.get('/login', require('./LoginPageRoute').get);
    app.get('/register', require('./RegisterPageRoute').get);
    app.get('/lobby', require('./LobbyPageRoute').get);
    app.get('/users', require('./UsersRoute').get);
    app.get('/user/:id', require('./UserRoute').get);
};