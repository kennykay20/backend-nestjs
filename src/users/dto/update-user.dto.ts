import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  id: string;

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

  @IsNumber()
  age: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
