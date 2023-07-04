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
    return result;
  }

  async getSecretKey(): Promise<string> {
    const { secret } = await this.userSvc.getSecretKeys();
    // await this.cacheService.save('app::secret', secret);
    return secret;
  }
}
