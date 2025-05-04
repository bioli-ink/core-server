import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

const transformer = (data) => {
  if (
    ['number', 'string', 'boolean', 'undefined'].includes(typeof data) ||
    data === null
  )
    return data;

  const result = {};

  if (data instanceof Array) {
    return data.map((item) => {
      return transformer(item);
    });
  }

  Object.keys(data).forEach((key) => {
    const value = data[key];

    result[
      key.replace(/(_[a-z])/g, (v) => {
        return v.replace('_', '').toUpperCase();
      })
    ] = typeof value === 'object' ? transformer(value) : value;
  });

  return result;
};

@Injectable()
export class KeyCaseTransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return transformer(data);
      }),
    );
  }
}
