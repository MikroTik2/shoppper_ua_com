const log4js = require('log4js');

log4js.configure({
     appenders: {
          out: {
               type: 'stdout',
               layout: {
                    type: 'pattern',
                    pattern: '[%d{dd.MM.yyyy hh:mm:ss}]%[[%p] %m%]',
               },
          },
          nodebug: {
               type: 'logLevelFilter',
               appender: 'out',
               level: 'info'
          },
          app: {
               type: 'file',
               filename: 'logs/main.log',
               layout: {
                    type: 'pattern',
                    pattern: '[%d{dd.MM.yyyy hh:mm:ss:SSS}][%p] %m',
               },
          },
     },

     categories: {
          default: {
               appenders: [(true ? 'out' : 'nodebug'), 'app'],
               level: 'debug'
          },
     },
});

const logger = log4js.getLogger();

module.exports = logger;