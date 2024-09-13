import { User } from './user.type';

export type ExtendedJwtPayload = {
  jti: string;
  sub: number;
  iat: number;
  exp: number;
} & User;
