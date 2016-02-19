var util = require('util');
var http = require('http');

// ошибки для выдачи посетителю
function HttpError(status, message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, HttpError); //gets stack from V8 engine until call of HttpError function

  this.status = status;
  this.message = message || http.STATUS_CODES[status] || "Error";
}

util.inherits(HttpError, Error);

HttpError.prototype.name = 'HttpError';

exports.HttpError = HttpError;


