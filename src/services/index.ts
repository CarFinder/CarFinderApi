import { IUser } from '../interfaces/index';
import { decodeToken } from '../utils';
import { confirm, getUser, register } from './userService';

export const registerUser = async (payload: IUser) => {
  if (!payload) {
    return;
  }
  await register(payload);
};

export const confirmUserEmail = async (payload: any) => {
  const data = decodeToken(payload.token);
  await confirm(data.email);
  const userData = await getUser(data.email);
  return userData;
};
