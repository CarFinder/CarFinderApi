import { IUser } from '../interfaces/index';
import { register } from './userService';

export const registerUser = async (payload: IUser) => {
  if (!payload) {
    return;
  }
  await register(payload);
};
