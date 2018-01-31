'use strict';

var log4js = require('log4js');
log4js.loadAppender('file');
// log4js.addAppender(log4js.appenders.console());
log4js.addAppender(log4js.appenders.file('logs/logs.log'));
let config = require('../log4js');

function log(name) {
    let logger = log4js.getLogger(name);
    let logLevel = config[name];
    if (logLevel) {
        logger.setLevel(logLevel)
    }
    return logger;
}

module.exports = log;
