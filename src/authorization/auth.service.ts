import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthorizationService {
  constructor(private readonly userSvc: UserService) {}

  async register(data: any, res: Response): Promise<any> {
    const user = await this.userSvc.handleRegisterUser(data, res);
    return user;
  }

  async loginEmailOrPhone(data: any, res: Response): Promise<any> {
    const user = await this.userSvc.handleLoginEmailOrPhone(data, res);
    return user;
  }

  async logoutUser(req: Request, res: Response): Promise<any> {
    const result = await this.userSvc.handleLogoutUser(req, res);
    console.log('after clear cookies ', req.cookies);
    console.log('after cleared signedcookies :: ', req.signedCookies);
    console.log('result 1 ', result.cookie);
    console.log('result 2 ', result.signedCookies);
    console.log('result 3 ', res.cookie);
    //console.log('result 4 ', result.res.cookie);
    //console.log('result 5 ', result.res.signedCookies);
    console.log('result 6 ', result.res);
    return result;
  }

  async getSecretKey(): Promise<string> {
    const { secret } = await this.userSvc.getSecretKeys();
    // await this.cacheService.save('app::secret', secret);
    return secret;
  }
}
