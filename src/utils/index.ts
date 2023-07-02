import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class Authentication {
  static generateSalt(): string {
    return crypto.randomBytes(49).toString('hex');
  }

  static generatePasswordHash(value: string, salt: string): string {
    return crypto.createHmac('sha256', salt).update(value).digest('hex');
  }

  static comparePassword(
    plainPassword: string,
    hash: string,
    salt: string,
  ): boolean {
    const newHash = this.generatePasswordHash(plainPassword, salt);
    return newHash === hash ? true : false;
  }

  static generateSaltBycr = async () => {
    const saltRounds = 10;
    return await bcrypt.genSalt(saltRounds);
  };

  static generateHashPasswordBycr = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
  };

  static comparePasswordBycr = async (
    plainPassword: string,
    hashPassword: string,
  ) => {
    return await bcrypt.compare(plainPassword, hashPassword);
  };
}
