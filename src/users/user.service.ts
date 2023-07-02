import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { Repository, EntityManager } from 'typeorm';
import { User } from './models/user.model';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as shortid from 'shortid';
import { Authentication } from 'src/utils';
import { Request, Response } from 'express';
import { generateToken, getRandomString, isValidEmail } from 'src/utils/auth';
import { SecretKeys } from './models/secret-key.model';
import { config } from '../config';

@Injectable()
export class UserService {
  private readonly userRepo: Repository<User>;
  private readonly secretKeyRepo: Repository<SecretKeys>;
  constructor(
    @InjectEntityManager()
    private readonly entityManger: EntityManager,
  ) {
    this.userRepo = this.entityManger.getRepository('users');
    this.secretKeyRepo = this.entityManger.getRepository('secret_keys');
  }
  async getAllUser(res: Response): Promise<any> {
    try {
      const user = await this.userRepo.find();
      //return res.status(200).json({ user });
      return res.status(200).json({ user });
    } catch (error) {
      return res
        .status(400)
        .json({ message: `Error.GetAllUser: ${error.message}` });
    }
  }

  async getUserById(id: string, res: Response): Promise<any> {
    try {
      const user = await this.userRepo.findOne({
        where: { id },
      });

      if (!user) {
        return res
          .status(403)
          .json({ message: `user with id ${id} not found` });
      }
      return { user };
    } catch (error) {
      return res
        .status(400)
        .json({ message: `Error.GetAllUser: ${error.message}` });
    }
  }

  async handleRegisterUser(data: CreateUserDTO, res: Response): Promise<any> {
    console.log(data);
    const { email, username, password, phone } = data;
    if (!username || !email || !password) {
      // return message
      return res
        .status(400)
        .json({ message: 'username, email and password are required' });
    }

    const duplicateUser = await this.checkDuplicateUser(email, phone);
    if (duplicateUser) {
      // return email already exist
      return res
        .status(409)
        .json({ message: 'email or phone number already exist' });
    }

    if (password.length <= 5) {
      return res
        .status(400)
        .json({ message: 'Password must be greater than 5 characters' });
    }

    const user = new User();
    user.id = shortid.generate();
    user.username = username;
    user.email = email ? email.toLowerCase().trim() : null;
    user.firstname = data.firstname;
    user.lastname = data.lastname;
    user.phone = data.phone;
    user.age = data.age;
    user.isActive = true;
    user.maritalStatus = data.maritalStatus;
    user.isDelete = false;

    if (password) {
      const salt = Authentication.generateSalt();
      const password = Authentication.generatePasswordHash(
        data.password.trim(),
        salt,
      );
      user.password = `${salt}-${password}`;
    }

    try {
      await this.userRepo.save(user);
      delete user.password;

      return res
        .status(201)
        .json({ message: 'User added successfully!', success: true });
    } catch (error) {
      console.log('ERROR.REGISTER.USER', error);
      return res.status(400).json({
        message: `Error saving User: ${error.message}`,
        success: false,
      });
    }
  }

  async handleLoginEmailOrPhone(data: any, res: Response): Promise<any> {
    const { email, password, phone } = data;
    let condition;

    if (email && isValidEmail(email)) {
      condition = { email, isDelete: false };
    } else {
      condition = { phone, isDelete: false };
    }

    try {
      const user: User = await this.userRepo.findOne({
        select: [
          'age',
          'email',
          'firstname',
          'lastname',
          'maritalStatus',
          'id',
          'isActive',
          'isDelete',
          'password',
          'username',
        ],
        where: condition,
      });

      if (!user) {
        return res
          .status(401)
          .json({ message: 'User not found, please register or sign up!' });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: 'User has been de-activated' });
      }

      let passwordMatch: boolean;
      if (user.password) {
        const salt = user.password.split('-')[0];
        const hashPassword = user.password.split('-')[1];
        passwordMatch = Authentication.comparePassword(
          password,
          hashPassword,
          salt,
        );
      }

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password ' });
      }
      delete user.password;
      const { secret } = await this.getSecretKeys();

      const token = generateToken(user, secret);
      return { user, token, roles: '', success: true };
    } catch (error) {
      console.log('ERROR.LOGIN.USER', error);
      return res.status(400).json({
        message: `Error Login User: ${error.message}`,
        success: false,
      });
    }
  }

  async handleLogoutUser(req: Request, res: Response): Promise<any> {
    console.log('cookiesss ', req.cookies);
    const token = req.cookies.accessToken || req.signedCookies.accessToken;
    console.log('token before ooo ', token);
    if (!token) {
      return res.sendStatus(204);
    }
    console.log('token again ', token);
    const user: any = JSON.parse(JSON.stringify(req.headers.user));
    console.log('user again ', user);
    const foundUser = await this.getUserById(user?.id, res);
    console.log('foundUser ', foundUser);
    try {
      if (!foundUser) {
        console.log('no founduser: ');
        res.clearCookie('accessToken', {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
        return res.sendStatus(204);
      }

      res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      console.log('after clear cookies n ', req.cookies);
      console.log('after cleared signedcookies n:: ', req.signedCookies);
      return res.sendStatus(204);
    } catch (error) {
      console.log('ERROR.LOGOUT.USER');
    }
  }

  async checkDuplicateUser(email: string, phone: string): Promise<any> {
    let isDuplicate = false;
    if (email) {
      const data = await this.userRepo.findOne({
        where: [
          {
            email,
            isDelete: false,
          },
          {
            phone,
            isDelete: false,
          },
        ],
      });
      if (data) {
        isDuplicate = true;
        return isDuplicate;
      } else {
        return isDuplicate;
      }
    } else {
      return;
    }
  }

  async generateSecret(): Promise<void> {
    const secret = getRandomString();
    const secretKeys = await this.secretKeyRepo.find();

    if (secretKeys.length === 0) {
      const secretData = new SecretKeys();
      secretData.secret = secret;
      await this.secretKeyRepo.save(secretData);
    }
  }

  async getSecretKeys(): Promise<any> {
    const secretData = await this.secretKeyRepo.find();
    const secret = config.secret_access_token;
    return { secret: secretData[0]?.secret ?? secret };
  }
}
