import { jwtDecode } from 'jwt-decode';
import { ExtendedJwtPayload } from '../types';

export const getJwtPayloadFromJwt = (accessToken: string): ExtendedJwtPayload | null => {
  try {
    const jwtPayload = jwtDecode(accessToken);
    return jwtPayload as unknown as ExtendedJwtPayload;
  } catch {
    return null;
  }
};
