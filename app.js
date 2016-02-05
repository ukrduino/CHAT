// adding modules
var express = require('express');
var http = require('http');
var path = require('path');
//configuration middleware (nconf)
var config = require('config');
//logging middleware (winston)
var logger = require('libs/log')(module);
//favicon serving middleware
var favicon = require('serve-favicon');
//HTTP request logger middleware
var morgan = require('morgan');
//Development-only error handler middleware
var errorHandler = require('errorhandler');
// connecting routes from routes folder
var routes = require('routes');
// setting template engine
var engine = require('ejs-mate');
// static serving middleware
var serveStatic = require('serve-static');


// creating app
var app = express();

// creating HTTP server.
var server = http.createServer(app);
// starting HTTP server.
server.listen(config.get('port'), function () {
    logger.info('App listens on port:' + config.get('port'));
});

// template  engine setup
app.engine('ejs', engine);
app.set('view engine', 'ejs');                        // template engine
app.set('views', path.join(__dirname, 'templates'));  // templates folder

app.use(favicon(path.join(__dirname + '/public/favicon.ico')));
if (app.get('env') == 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('tiny'));
}

app.use('/', routes);

app.use(serveStatic(path.join(__dirname, 'public')));


// error handler(function with four args, first is error)
// NODE_ENV - environment variable can be set to 'development' or 'production'
// if it not set we use app.get('env'), default set to development
app.use(function (err, req, res, next) {
    //app.set('env', 'prod');
    if (process.env.NODE_ENV == 'development') {
        var errorHandler = errorHandler();
        errorHandler(err, req, res, next);
    } else {
        res.sendStatus(500);
    }
});