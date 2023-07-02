import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import * as session from 'express-session';

export function SelfTokenMiddleware(
  req: Request,
  res: Response,
  next: () => any,
) {
  const token = req.signedCookies.accessToken;
  const hundredYears = 100 * 365 * 24 * 60 * 60 * 1000;
  if (!token) {
    res.cookie('accessToken ', uuidv4(), {
      signed: true,
      expires: new Date(Date.now() + hundredYears),
      sameSite: false,
      secure: true,
      httpOnly: false,
    });
  }
  return next();
}

export function SessionMiddleware(secret: string) {
  //console.log('inside session middleware ', secret);
  //const store = new RedisConnectStore({ client: cacheService.getClient() });
  return session({
    saveUninitialized: true,
    secret,
    resave: false,
    cookie: {
      secure: true,
      sameSite: false,
      signed: true,
      httpOnly: false,
    },
    name: 'kennybowen.sid',
    proxy: true,
    rolling: true,
  });
}
