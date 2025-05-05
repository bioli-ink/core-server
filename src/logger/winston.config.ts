import * as winston from 'winston';
import 'winston-daily-rotate-file';

const getLoggerDir = (() => {
  let dir = '';

  switch (process.env.NODE_ENV) {
    case 'development':
      dir = 'logs';
      break;
    case 'test':
      dir = '/data/log/test';
      break;
    case 'production':
      dir = '/data/log/production';
      break;
    default:
      dir = '/data/log/unknown_env';
      break;
  }

  return dir;
})();

const customFormat = winston.format.printf((props) => {
  const { level, message, timestamp } = props;
  return `[Time: ${timestamp}] [Level: ${level}] ${message}`;
});

export const loggerConfig: winston.LoggerOptions = {
  transports: [
    new winston.transports.DailyRotateFile({
      filename: `${getLoggerDir}/info/%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // 添加过滤：仅允许 info 级别
        winston.format((info) => (info.level === 'info' ? info : false))(),
        customFormat,
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: `${getLoggerDir}/error/%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // 添加过滤：仅允许 error 级别
        winston.format((info) => (info.level === 'error' ? info : false))(),
        customFormat,
      ),
    }),
  ],
};

export const logger = winston.createLogger(loggerConfig);
