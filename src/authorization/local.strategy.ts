import { Body, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthorizationService } from './auth.service';
import { LoginUserDto } from './dto/auth.dto';
import { Response } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authSvc: AuthorizationService) {
    super();
  }

  async validate(
    @Body() loginData: LoginUserDto,
    @Res() res: Response,
  ): Promise<any> {
    const user = await this.authSvc.loginEmailOrPhone(loginData, res);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
