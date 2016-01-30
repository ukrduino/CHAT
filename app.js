// adding modules
var express = require('express');
var http = require('http');
var path = require('path');

/**
 * https://www.npmjs.com/package/errorhandler
 * separate module need to be installed:
 * npm install errorhandler
 */
var errorhandler = require('errorhandler');

// creating app
var app = express();
app.set('port', 3000);

// creating HTTP server.
var server = http.createServer(app);
// starting HTTP server.
server.listen(app.get('port'), function () {
    console.log('App listens on port:' + app.get('port'));
});

// middleware for url '/'
app.use(function (req, res, next) {
    if (req.url == '/') {
        res.end('Hello !!!');
    } else {
        next(); // passes execution to next function defined with app.use below
    }
});

app.use(function (req, res, next) {
    if (req.url == '/test') {
        res.end('TEST !!!');
    } else {
        next(); // passes execution to next function defined with app.use below
    }
});

//error check middleware
app.use(function (req, res, next) {
    if (req.url == '/forbidden') {
        var err = new Error('woops, DENIED !!!');
        err.status = 401;
        next(err);// throws Error to errorHandler
    } else {
        next(); // passes execution to next function defined with app.use below
    }
});

// final middleware should not have next() function... all execution stops here
app.use(function (req, res) {
    res.status(404).send("Page NOT Found");
});

// error handler(function with four args, first is error)
// NODE_ENV - environment variable can be set to 'development' or 'production'
// if it not set we use app.get('env')
app.use(function (err, req, res, next) {
    //app.set('env', 'prod');
    if (app.get('env') == 'development') {
        var errorHandler = errorhandler();
        errorHandler(err, req, res, next);
    } else {
        res.sendStatus(500);
    }
});



//// development error handler
//// will print stacktrace
//if (app.get('env') == 'development') {
//    app.use(function (err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});


//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
//
//var routes = require('./routes/index');
//var users = require('./routes/users');
//
//
//// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
//
//// uncomment after placing your favicon in /public
////app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
//
//app.use('/', routes);
//app.use('/users', users);
//
//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});
//
//
//module.exports = app;
//
///**
// * Module dependencies.
// */
//
//var debug = require('debug')('CHAT:server');
//
///**
// * Get port from environment and store in Express.
// */
//
//var port = normalizePort(process.env.PORT || '3000');
//app.set('port', port);
//
//*
//
///**
// * Listen on provided port, on all network interfaces.
// */
//
//server.listen(port);
//server.on('error', onError);
//server.on('listening', onListening);
//
///**
// * Normalize a port into a number, string, or false.
// */
//
//function normalizePort(val) {
//    var port = parseInt(val, 10);
//
//    if (isNaN(port)) {
//        // named pipe
//        return val;
//    }
//
//    if (port >= 0) {
//        // port number
//        return port;
//    }
//
//    return false;
//}
//
///**
// * Event listener for HTTP server "error" event.
// */
//
//function onError(error) {
//    if (error.syscall !== 'listen') {
//        throw error;
//    }
//
//    var bind = typeof port === 'string'
//        ? 'Pipe ' + port
//        : 'Port ' + port;
//
//    // handle specific listen errors with friendly messages
//    switch (error.code) {
//        case 'EACCES':
//            console.error(bind + ' requires elevated privileges');
//            process.exit(1);
//            break;
//        case 'EADDRINUSE':
//            console.error(bind + ' is already in use');
//            process.exit(1);
//            break;
//        default:
//            throw error;
//    }
//}
//
///**
// * Event listener for HTTP server "listening" event.
// */
//
//function onListening() {
//    var addr = server.address();
//    var bind = typeof addr === 'string'
//        ? 'pipe ' + addr
//        : 'port ' + addr.port;
//    debug('Listening on ' + bind);
//}
