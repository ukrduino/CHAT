var mongoose = require('libs/mongoose');
mongoose.set('debug', true);
var async = require('async');

async.series([open,
    dropDataBase,
    requireModels,
    createUsers], function (err) {
    mongoose.disconnect();
});

//Opening connection to db
function open(callback) {
    mongoose.connection.on('open', callback);
}

//Deleting db
function dropDataBase(callback) {
    var db = mongoose.connection.db;
    if (mongoose.connection.readyState == 1) {
        console.log('mongoose connected to DB')
    }
    db.dropDatabase(callback);
}

// Creating indexes for each model
function requireModels(callback) {
    require('./models/user');
    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

// Creating Users
function createUsers(callback) {
    var users = [
        {username: 'Вася', email: 'vasia@mail.ru', password: 'secret'},
        {username: 'Петя', email: 'petya@mail.ru', password: 'badguy'},
        {username: 'Админ', email: 'admin@mail.ru', password: 'hero'}
    ];

    async.each(users,
        function (userDetails, callback) {
            var user = new mongoose.models.User(userDetails);
            user.save(callback);
        },
        callback);
}


