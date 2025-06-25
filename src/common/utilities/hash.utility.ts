import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

export const createHashedPassword = (plainPassword: string) => {
  return bcrypt.hashSync(plainPassword, 10);
};

export const generateRandomPassword = (length: number) => {
  return crypto.randomBytes(length).toString('hex'); // 100 bytes * 2 hex characters per byte = 200 characters
};

export const comparePassword = (plainPassword: string, hashedPassword: string) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

export const generateStrongRandomPassword = (length: number) => {
  return generateRandomPassword(length);
};
