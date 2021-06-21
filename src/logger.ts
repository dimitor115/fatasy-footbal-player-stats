import {createLogger, format, transports} from 'winston'

export const logger = createLogger({
    level: process.env.LOG_LEVEL,
    format: format.combine(
      format.errors({ stack: true }),
      format.prettyPrint(),
      format.colorize(),
    ),
    transports: [
        new transports.Console({
            format: format.simple(),
          })
    ]
});