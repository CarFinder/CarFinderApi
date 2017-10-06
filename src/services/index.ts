import { IUser } from '../interfaces/index';
import { register } from './userService';

export const registerUser = async (payload: IUser) => {
  try {
    await register(payload);
  } catch (error) {
    throw error;
  }
};
