import { IUser } from '../interfaces/index';
import { decodeToken } from '../utils';
import * as AdService from './adService';
import * as FilterService from './filterService';
import { confirm, getUserData, register, restorePassword, sendPasswordEmail } from './userService';

import * as UserService from './userService';

export const registerUser = async (payload: IUser) => {
  await register(payload);
};

export const sendRestorePasswordEmail = async (payload: string) => {
  await sendPasswordEmail(payload);
};

export const restoreUserPassword = async (payload: { password: string; token: string }) => {
  const data = decodeToken(payload.token);
  await restorePassword(payload.password, data.email);
};

export const confirmUserEmail = async (payload: any) => {
  const data = decodeToken(payload.token);
  await confirm(data.email);
  const userData = await getUserData(data.email);
  return userData;
};

export { AdService, FilterService, UserService };
