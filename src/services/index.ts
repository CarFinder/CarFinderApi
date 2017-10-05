import { IUser } from '../interfaces/index';
import { register } from './user_service';

export const registerUser = async (payload: IUser) => {
  try {
    await register(payload);
  } catch (error) {
    return error;
  }
};
