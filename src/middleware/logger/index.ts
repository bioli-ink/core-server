import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from 'src/logger/winston.config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    // 接口进入服务，输出日志
    logger.info(
      [
        `[status: request]`,
        `[method: ${req.method}]`,
        `[url: ${req.originalUrl}]`,
        `[traceId: ${req.headers['x-trace-id']}]`,
        `[query: ${JSON.stringify(req.query)}]`,
        `[body: ${JSON.stringify(req.body)}]`,
      ].join(' '),
    );

    next();
  }
}
