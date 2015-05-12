var winston = require('winston');
var configFile = require('../configs/config');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: function () { var now = new Date(); return now.getFullYear() + '.' + now.getMonth() + '.' + now.getDay() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds() } }),
    new winston.transports.File({ filename: configFile.logfiles.info, json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: function () { var now = new Date(); return now.getFullYear() + '.' + now.getMonth() + '.' + now.getDay() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds() } }),
    new winston.transports.File({ filename: configFile.logfiles.errors, json: false })
  ],
  exitOnError: false
});

module.exports = logger;