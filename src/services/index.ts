import { IUser } from '../interfaces/index';
import { register } from './userService';

export const registerUser = async (payload: IUser) => {
  await register(payload);
};
