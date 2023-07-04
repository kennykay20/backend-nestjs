import { Controller, Get, Inject, Res, Req, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userSvc: UserService,
  ) {}
  @Get()
  async getUser() {
    return 'I am a user testing';
  }

  @Get('getAllUser')
  async GetAllUser(@Req() req: Request, @Res() res: Response) {
    return this.userSvc.getAllUser(res);
  }

  @Get(':id')
  async GetUserById(@Param('id') id: string, @Res() res: Response) {
    return this.userSvc.getUserById(id, res);
  }
}
