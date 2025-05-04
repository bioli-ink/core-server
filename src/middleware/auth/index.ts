// import * as cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, HTTP_STATUS_TEXT } from 'src/constant/status/http';

const URL_WHITE_LIST = ['/auth/register', '/auth/login', '/auth/verify-code'];
const URL_WHITE_LIST_PREFIX = ['/transfer'];

export function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // cookieParser()(req, res, () => {
  if (
    !URL_WHITE_LIST.includes(req.path) &&
    !URL_WHITE_LIST_PREFIX.filter((prefix) => req.path.includes(prefix))
      .length &&
    !req.path.startsWith('/client')
  ) {
    const auth = req.headers['authorization'] as string;

    if (auth) {
      const [, token] = auth.split(' ');

      if (!token) {
        res.status(401).end(HTTP_STATUS_TEXT[HTTP_STATUS.LOGIN_EXPIRED]);
        return;
      }

      try {
        const result = jwt.verify(token, process.env.LOGIN_AUTH_KEY);

        // 将用户的唯一 id 存在请求 headers 中，后面可以直接拿来用
        req.headers[process.env.HEADER_ID_KEY] = result.sub as string;
      } catch {
        res.status(401).end(HTTP_STATUS_TEXT[HTTP_STATUS.LOGIN_EXPIRED]);
        return;
      }
    } else {
      res.status(401).end(HTTP_STATUS_TEXT[HTTP_STATUS.LOGIN_EXPIRED]);
      return;
    }

    // }
  }

  next();
  // });
}
