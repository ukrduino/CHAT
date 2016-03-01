// static serving middleware
var serveStatic = require('serve-static');

module.exports = function (app) {
    app.use(serveStatic(__dirname));
    app.use('/user', serveStatic(__dirname));
    app.use('/room', serveStatic(__dirname));
    app.use('/lobby', serveStatic(__dirname));
};