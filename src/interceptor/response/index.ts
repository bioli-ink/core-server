import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { logger } from 'src/logger/winston.config';
import { statusTextTransform } from 'src/utils/code';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data) => {
          const returnData = data?.code
            ? data
            : {
                data,
                code: 0,
                message: '',
              };
          const args = context.getArgs()[0];
          const headers = args.headers;

          // 接口正常返回，输出日志
          logger.info(
            [
              `[status: success]`,
              `[method: ${args.method}]`,
              `[url: ${args.url}]`,
              `[traceId: ${headers['x-trace-id'] || ''}]`,
              `[uid: ${headers.user.id || 'anonymous'}]`,
              `[response: ${JSON.stringify(returnData)}]`,
            ].join(' '),
          );

          return returnData;
        }),
      )
      .pipe(
        catchError((err) => {
          const args = context.getArgs()[0];
          const headers = args.headers;

          // 接口报错，输出日志
          logger.error(
            [
              `[status: error]`,
              `[method: ${args.method}]`,
              `[url: ${args.url}]`,
              `[traceId: ${headers['x-trace-id'] || ''}]`,
              `[uid: ${headers.user.id || 'anonymous'}]`,
              `[response: ${JSON.stringify(err)}]`,
            ].join(' '),
          );

          if (!err.response) {
            return throwError(
              () =>
                new BadGatewayException({
                  code: HttpStatus.INTERNAL_SERVER_ERROR,
                  message: statusTextTransform(
                    HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
                  ),
                }),
            );
          }

          const error = {
            code: err.response.statusCode,
            message: Array.isArray(err.response.message)
              ? err.response.message[0]
              : err.response.message,
          };

          if (String(error.code).startsWith('4')) {
            return throwError(() => new BadRequestException(error));
          }

          return throwError(() => new BadGatewayException(error));
        }),
      );
  }
}
