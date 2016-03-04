var session = require('express-session');
var mongoose = require('libs/mongoose');
var MongoStore = require('connect-mongo')(session);

var sessionStore = new MongoStore({mongooseConnection: mongoose.connection});

module.exports = sessionStore;