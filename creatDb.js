var mongoose = require('libs/mongoose');
mongoose.set('debug', true);
var async = require('async');

async.series([open,
    dropDataBase,
    requireModels,
    createUsers], function (err) {
    mongoose.disconnect();
    console.log(arguments);
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDataBase(callback) {
    var db = mongoose.connection.db;
    console.log(mongoose.connection.readyState);
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('models/user');
    async.each(Object.keys(mongoose.models), function (modelName, calback) {
        mongoose.models[modelName].ensureIndexes(calback);
    }, callback);
}

function createUsers(callback) {
    var users = [
        {username: 'Вася', password: 'secret'},
        {username: 'Петя', password: 'badguy'},
        {username: 'Админ', password: 'hero'}
    ];

    async.each(users,
        function (userDetails, callback) {
            var user = new mongoose.models.User(userDetails);
            user.save(callback);
        },
        callback);
}


