import { Module } from '@nestjs/common';
import { AuthorizationService } from './auth.service';
import { AuthorizationController } from './auth.controller';
//import { UserService } from 'src/users/user.service';
import { UserModule } from 'src/users/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthorizationService, LocalStrategy],
  controllers: [AuthorizationController],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
