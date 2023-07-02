import { Controller, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileSvc: ProfileService) {}

  @Get()
  async GetUserProfile() {
    return {
      message: `this is a protected route, you are authorised!`,
    };
  }
}
