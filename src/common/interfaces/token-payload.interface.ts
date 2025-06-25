import { UserRoleEnum } from '../constants/user-role.enum';

export interface TokenPayload {
  userId: number;
  email: string;
  type: UserRoleEnum;
}
