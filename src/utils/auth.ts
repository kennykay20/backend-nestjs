import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/models/user.model';

export const getRandomString = () => randomBytes(200).toString('hex');

export function isValidEmail(email: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const generateToken = (user: User, secret: string): string => {
  const { id } = user;
  return jwt.sign(
    {
      userInfo: {
        userId: id,
      },
    },
    secret,
    {
      algorithm: 'HS512',
      expiresIn: '365d',
    },
  );
};

export const generateShortToken = (user: User, secret: string): string => {
  const { id } = user;
  return jwt.sign(
    {
      userInfo: {
        userId: id,
      },
    },
    secret,
    {
      algorithm: 'HS512',
      expiresIn: 300,
    },
  );
};
