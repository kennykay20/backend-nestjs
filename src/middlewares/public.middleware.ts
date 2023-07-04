import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AuthorizationService } from 'src/authorization/auth.service';

@Injectable()
export class PublicMiddleware implements NestMiddleware {
  constructor(private readonly authSvc: AuthorizationService) {}
  async use(req: Request, res: Response, next: () => any) {
    const secret = await this.authSvc.getSecretKey();

    let token = '';
    const reqClone: any = Object.assign({}, req);
    if (reqClone.signedCookies && reqClone.signedCookies.accessToken) {
      token = reqClone.signedCookies.accessToken;
    } else {
      const headers = req.headers;
      if (headers['authorization'] === undefined) {
        return next();
      }
      token = headers['authorization'].split(' ')[1];
      if (token === undefined) {
        return next();
      }
    }

    try {
      if (token && token !== 'undefined') {
        jwt.verify(token, secret, (err, decoded) => {
          if (err || !decoded['userInfo']) return res.sendStatus(403);
          req.headers['user'] = JSON.stringify({
            id: decoded['userInfo'].userId,
            roles: '',
            email: '',
          });
        });
      } else {
        return next();
      }
    } catch (err) {
      console.error(err);
      return next();
    }

    return next();
  }
}
