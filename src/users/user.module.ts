import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.model';
import { SecretKeys } from './models/secret-key.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, SecretKeys])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
