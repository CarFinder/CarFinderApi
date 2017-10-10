import { IUser } from '../interfaces/index';
import { decodeToken } from '../utils';
import { register } from './userService';

export const registerUser = async (payload: IUser) => {
  if (!payload) {
    return;
  }
  await register(payload);
};

export const confirmUserEmail = async (payload: any) => {
  const email = decodeToken(payload.token);
 
};
