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
import { statusTextTransform } from 'src/utils/code';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data) => {
          return {
            data,
            code: 0,
            message: '',
          };
        }),
      )
      .pipe(
        catchError((err) => {
          // TODO logger error

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
