import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

export function traceIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let sn = req.get('sn');
  if (!sn) {
    sn = nanoid(32);
  }

  req.headers.sn = sn;
  res.set('sn', sn);
  next();
}
