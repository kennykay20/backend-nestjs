import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthorizationService } from 'src/authorization/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authSvc: AuthorizationService) {}

  async use(req: Request, res: Response, next: () => any) {
    const secret = await this.authSvc.getSecretKey();
    let token = '';
    const authHeader =
      req.headers.authorization || req.headers['authorization'];

    const reqClone: any = Object.assign({}, req);
    if (reqClone.signedCookies && reqClone.signedCookies.accessToken) {
      token = reqClone.signedCookies.accessToken;
    } else {
      console.log('no signedCookies ');
      if (!authHeader) {
        // return 401
        return res.status(401).json({
          title: 'no authorization header or cookies ',
          message: 'authorization header or cookie is required for this route',
        });
      }

      token = authHeader?.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          title: 'no authorization token or cookie present',
          message:
            'authorization token or cookie is required, token for this route in the format: <Bearer token>',
        });
      }
    }

    try {
      jwt.verify(token, secret, (err, decoded) => {
        if (err || !decoded['userInfo']) return res.sendStatus(403);
        req.headers['user'] = JSON.stringify({
          id: decoded['userInfo'].userId,
          roles: '',
          email: '',
        });
      });
    } catch (error) {
      console.log('ERROR.VERIFY.TOKEN');
      res.json({ message: `ERROR.verify.token: ${error.message}` });
    }
    return next();
  }
}
