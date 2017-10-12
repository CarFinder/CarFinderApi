import { IUser } from '../interfaces/index';
import { decodeToken } from '../utils';
import { confirm, getUserData, register } from './userService';

import * as AdService from './adService';
import * as UserService from './userService';

export const registerUser = async (payload: IUser) => {
  await register(payload);
};

export const confirmUserEmail = async (payload: any) => {
  const data = decodeToken(payload.token);
  await confirm(data.email);
  const userData = await getUserData(data.email);
  return userData;
};

export { AdService, UserService };
