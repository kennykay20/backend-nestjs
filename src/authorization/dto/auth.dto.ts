import { IsEmail, IsNumber, IsString } from 'class-validator';

export class LoginUserDto {
  email?: string;

  @IsString()
  password: string;

  phone?: string;
}

export class CreateUserDTO {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  phone: string;

  @IsString()
  maritalStatus: string;

  @IsNumber()
  age: number;
}
