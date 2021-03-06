// adding modules
var express = require('express');
var http = require('http');
var path = require('path');

//configuration middleware (nconf)
var config = require('./config');

//logging middleware (winston)
var logger = require('libs/log')(module);

//favicon serving middleware
var favicon = require('serve-favicon');

//HTTP request logger middleware
var morgan = require('morgan');

//Development-only error handler middleware
var errorHandler = require('errorhandler');

// connecting routes from routes folder
var routes = require('./routes');

// setting template engine
var engine = require('ejs-mate');

// custom HttpError handler
var HttpError = require('./error').HttpError;

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('libs/mongoose');

// creating app
var app = express();

// creating HTTP server.
var server = http.createServer(app);
// starting HTTP server.
server.listen(config.get('port'), function () {
    logger.info('App listens on port:' + config.get('port'));
});

// creating server socket
require('./libs/serverSocket')(server);


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// template  engine setup
app.engine('ejs', engine);
app.set('view engine', 'ejs');                        // template engine

app.set('views', path.join(__dirname, 'templates'));  // templates folder

app.use(favicon(path.join(__dirname + '/static/favicon.ico')));

// HTTP logger configuration
if (app.get('env') == 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('tiny'));
}

app.use(cookieParser());

var sessionStore = require('./libs/sessionStore');

app.use(session(
    {
        secret: config.get('session:secret'), // ABCDE242342342314123421.SHA256
        key: config.get('session:key'),
        cookie: config.get('session:cookie'),
        store: sessionStore,
        resave: config.get('session:resave'), //https://github.com/expressjs/session#options
        saveUninitialized: config.get('session:saveUninitialized') //https://github.com/expressjs/session#options

    }
));
// For session testing
//app.use(function(req, res, next) {
//    req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
//    res.send("Visits: " + req.session.numberOfVisits);
//});

// connecting custom middleware
app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

// connecting routs to application
require('./routes')(app);

// setting path for static files
require('./static')(app);

// error handling
app.use(function (err, req, res, next) {
    if (typeof err == 'number') { // next(404);
        err = new HttpError(err);
    }
    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            errorHandler()(err, req, res, next);
        } else {
            logger.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
    next();
});