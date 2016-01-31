var winston = require('winston');

// passing module to logger constructor used to get path(dir and file name in this case) of module that will use loggers instance
function getLogger(module) {

    var path = module.filename.split('\\').slice(-2).join('\\'); // on unix systems change \\ to /

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: (process.env.NODE_ENV == 'development') ? 'debug' : 'error',
                label: path
            })
        ]
    });
}
// returns customised logger instance
module.exports = getLogger;