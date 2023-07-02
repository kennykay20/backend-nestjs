import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { CreateUserDTO, LoginUserDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { AuthorizationService } from './auth.service';
//import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthorizationController {
  constructor(private readonly AuthSvc: AuthorizationService) {}

  @Post('registeruser')
  async RegisterUser(
    @Body() createUserDTO: CreateUserDTO,
    @Res() res: Response,
  ) {
    return this.AuthSvc.register(createUserDTO, res);
  }

  //@UseGuards(AuthGuard('local'))
  @Post('login')
  async Login(@Body() loginData: LoginUserDto, @Res() res: Response) {
    const response = await this.AuthSvc.loginEmailOrPhone(loginData, res);
    // console.log('response.token :: ', response.token);
    return res
      .status(200)
      .cookie('accessToken', response.token, {
        //secure: true,
        signed: true,
        httpOnly: true,
      })
      .json(response);
  }

  @Post('logout')
  async Logout(@Req() req: Request, @Res() res: Response) {
    return await this.AuthSvc.logoutUser(req, res);
  }
}
